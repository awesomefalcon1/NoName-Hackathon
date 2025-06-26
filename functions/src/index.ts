import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import { v4 as uuidv4 } from "uuid"
import * as Busboy from "busboy"

// Initialize Firebase Admin SDK
admin.initializeApp()
const db = admin.firestore()
const storage = admin.storage()

// Define CORS options
const cors = require("cors")({ origin: true })

// Types for API requests and responses
interface GenerateRecipeRequest {
  name: string
  recipeImage: File // This will be handled as multipart form data
  briefDescription: string
}

interface GenerateRecipeResponse {
  success: boolean
  data?: {
    draftId: string // ID to reference this draft later
    generatedRecipe: string
    extractedIngredients: ExtractedIngredient[]
    imageUrl: string // Temporary image URL
  }
  error?: string
  message?: string
}

interface ExtractedIngredient {
  id: string
  name: string
  quantity: string
  storeProduct?: {
    id: string
    name: string
    price: string
    imageUrl: string
  }
}

interface SubmitRecipeRequest {
  draftId: string // Reference to the draft created in generateRecipe
  recipeName: string
  briefIngredients: string
  fullRecipe: string
  ingredients: RecipeIngredient[]
}

interface RecipeIngredient {
  name: string
  quantity: string
  storeProductId?: string | null
  storeProductName?: string | null
  storeProductPrice?: string | null
  storeProductImageUrl?: string | null
}

interface SubmitRecipeResponse {
  success: boolean
  message: string
  recipeId?: string
  imageUrl?: string
  error?: string
  details?: string
}

// Helper function to authenticate user
async function authenticateUser(req: functions.Request): Promise<admin.auth.DecodedIdToken | null> {
  const idToken = req.headers.authorization?.split("Bearer ")[1]
  if (!idToken) {
    return null
  }

  try {
    return await admin.auth().verifyIdToken(idToken)
  } catch (error) {
    console.error("Error verifying ID token:", error)
    return null
  }
}

// Helper function to parse multipart form data
function parseMultipartData(req: functions.Request): Promise<{
  fields: { [key: string]: any }
  fileBuffer: Buffer | null
  fileMimeType: string | null
  originalFileName: string | null
}> {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers })
    const fields: { [key: string]: any } = {}
    let fileBuffer: Buffer | null = null
    let fileMimeType: string | null = null
    let originalFileName: string | null = null

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (fieldname !== "recipeImage") {
        file.resume() // Ignore other files
        return
      }

      originalFileName = filename.filename
      fileMimeType = mimetype

      const chunks: Buffer[] = []
      file.on("data", (chunk) => {
        chunks.push(chunk)
      })
      file.on("end", () => {
        fileBuffer = Buffer.concat(chunks)
      })
      file.on("error", reject)
    })

    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val
    })

    busboy.on("finish", () => {
      resolve({ fields, fileBuffer, fileMimeType, originalFileName })
    })

    busboy.on("error", reject)

    req.pipe(busboy)
  })
}

// Helper function to validate image file
function validateImageFile(fileBuffer: Buffer | null, fileMimeType: string | null): { valid: boolean; error?: string } {
  if (!fileBuffer || !fileMimeType) {
    return { valid: false, error: "Image file is required" }
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  const maxFileSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(fileMimeType)) {
    return { valid: false, error: "Please upload a valid image file (JPG, PNG, GIF, WebP)" }
  }

  if (fileBuffer.length > maxFileSize) {
    return { valid: false, error: "Image file must be smaller than 5MB" }
  }

  return { valid: true }
}

// Mock AI function to generate recipe (replace with actual AI service)
async function generateRecipeWithAI(
  recipeName: string,
  briefDescription: string,
  imageBuffer: Buffer,
): Promise<{
  generatedRecipe: string
  extractedIngredients: ExtractedIngredient[]
}> {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock generated recipe
  const generatedRecipe = `
# ${recipeName}

## Ingredients:
${briefDescription
  .split(",")
  .map((ing) => `- ${ing.trim()}`)
  .join("\n")}

## Instructions:
1. Prepare your ingredients: ${briefDescription}.
2. Cook the main components according to their requirements.
3. Combine all ingredients in the proper order.
4. Season to taste and adjust flavors as needed.
5. Serve hot and enjoy your delicious ${recipeName}!

## Tips:
- Make sure all ingredients are fresh for the best flavor.
- Adjust cooking times based on your preferences.
- Feel free to customize with your favorite seasonings.
  `.trim()

  // Mock extracted ingredients with store products
  const extractedIngredients: ExtractedIngredient[] = briefDescription.split(",").map((ing, index) => ({
    id: `ing-${index}-${Date.now()}`,
    name: ing.trim(),
    quantity: "1 unit",
    storeProduct:
      Math.random() > 0.3
        ? {
            id: `prod-${index}-${Date.now()}`,
            name: `NoName ${ing.trim()}`,
            price: `$${(Math.random() * 5 + 1).toFixed(2)}`,
            imageUrl: `/placeholder.svg?width=50&height=50&text=${ing.trim().charAt(0)}`,
          }
        : undefined,
  }))

  return { generatedRecipe, extractedIngredients }
}

// Cloud Function 1: Generate Recipe and Ingredients (Store as Draft)
export const generateRecipe = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "METHOD_NOT_ALLOWED",
        message: "Only POST requests are allowed.",
      } as GenerateRecipeResponse)
    }

    // Authenticate user
    const decodedToken = await authenticateUser(req)
    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "Authentication required.",
      } as GenerateRecipeResponse)
    }

    const userId = decodedToken.uid
    const userName = decodedToken.name || decodedToken.email || "Anonymous Chef"

    try {
      // Parse multipart form data
      const { fields, fileBuffer, fileMimeType, originalFileName } = await parseMultipartData(req)

      const { name, briefDescription } = fields

      // Validate required fields
      if (!name || !briefDescription) {
        return res.status(400).json({
          success: false,
          error: "MISSING_FIELDS",
          message: "Recipe name and brief description are required.",
        } as GenerateRecipeResponse)
      }

      // Validate image file
      const imageValidation = validateImageFile(fileBuffer, fileMimeType)
      if (!imageValidation.valid) {
        return res.status(400).json({
          success: false,
          error: "INVALID_IMAGE",
          message: imageValidation.error,
        } as GenerateRecipeResponse)
      }

      // Upload image to Firebase Storage (temporary location)
      const bucket = storage.bucket()
      const draftId = uuidv4() // Generate unique draft ID
      const imageFileName = `${userId}/${draftId}-${originalFileName}`
      const file = bucket.file(`recipeDrafts/${imageFileName}`)

      await file.save(fileBuffer!, {
        metadata: {
          contentType: fileMimeType!,
        },
      })

      // Get temporary URL for the image
      const [imageUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
      })

      // Generate recipe and ingredients using AI (mock implementation)
      const { generatedRecipe, extractedIngredients } = await generateRecipeWithAI(name, briefDescription, fileBuffer!)

      // Store draft in Firestore
      const draftData = {
        draftId,
        userId,
        userName,
        recipeName: name,
        briefDescription,
        generatedRecipe,
        extractedIngredients,
        imageUrl,
        imagePath: `recipeDrafts/${imageFileName}`, // Store path for later use
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "draft", // Mark as draft
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // Expire in 24 hours
      }

      await db.collection("recipeDrafts").doc(draftId).set(draftData)

      return res.status(200).json({
        success: true,
        data: {
          draftId,
          generatedRecipe,
          extractedIngredients,
          imageUrl,
        },
        message: "Recipe and ingredients generated and saved as draft!",
      } as GenerateRecipeResponse)
    } catch (error) {
      console.error("Error in generateRecipe Cloud Function:", error)
      return res.status(500).json({
        success: false,
        error: "SERVER_ERROR",
        message: "An internal server error occurred during recipe generation.",
      } as GenerateRecipeResponse)
    }
  })
})

// Cloud Function 2: Submit Recipe (Convert Draft to Final Recipe)
export const submitRecipe = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "METHOD_NOT_ALLOWED",
        message: "Only POST requests are allowed.",
      } as SubmitRecipeResponse)
    }

    // Authenticate user
    const decodedToken = await authenticateUser(req)
    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "Authentication token missing or invalid.",
      } as SubmitRecipeResponse)
    }

    const userId = decodedToken.uid

    try {
      // Parse form data (no file upload needed here, just text fields)
      const { fields } = await parseMultipartData(req)

      const { draftId, recipeName, briefIngredients, fullRecipe, ingredients: ingredientsString } = fields

      // Basic validation of received fields
      if (!draftId || !recipeName || !briefIngredients || !fullRecipe || !ingredientsString) {
        return res.status(400).json({
          success: false,
          error: "MISSING_FIELDS",
          message: "Missing required recipe information or draft ID.",
        } as SubmitRecipeResponse)
      }

      // Retrieve the draft from Firestore
      const draftDoc = await db.collection("recipeDrafts").doc(draftId).get()
      if (!draftDoc.exists) {
        return res.status(404).json({
          success: false,
          error: "DRAFT_NOT_FOUND",
          message: "Recipe draft not found or has expired.",
        } as SubmitRecipeResponse)
      }

      const draftData = draftDoc.data()!

      // Verify the draft belongs to the authenticated user
      if (draftData.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: "UNAUTHORIZED_DRAFT",
          message: "You are not authorized to submit this draft.",
        } as SubmitRecipeResponse)
      }

      // Parse and validate ingredients
      let ingredients: RecipeIngredient[]
      try {
        ingredients = JSON.parse(ingredientsString)
        if (!Array.isArray(ingredients)) {
          throw new Error("Ingredients must be an array.")
        }
        for (const ingredient of ingredients) {
          if (!ingredient.name || !ingredient.quantity) {
            throw new Error("Each ingredient must have a name and quantity.")
          }
        }
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: "INVALID_INGREDIENTS_FORMAT",
          message: "Ingredients must be a valid JSON array with name and quantity for each item.",
        } as SubmitRecipeResponse)
      }

      // Move image from draft location to final location
      const bucket = storage.bucket()
      const draftImagePath = draftData.imagePath
      const finalImagePath = `recipeImages/${userId}/${uuidv4()}-${recipeName.replace(/[^a-zA-Z0-9]/g, "_")}`

      const draftFile = bucket.file(draftImagePath)
      const finalFile = bucket.file(finalImagePath)

      // Copy the file to the final location
      await draftFile.copy(finalFile)

      // Get permanent URL for the final image
      const [finalImageUrl] = await finalFile.getSignedUrl({
        action: "read",
        expires: "03-09-2491", // A far future date for effectively public read access
      })

      // Prepare final recipe data for Firestore
      const recipeData = {
        userId,
        userName: draftData.userName,
        recipeName,
        briefIngredients,
        fullRecipe,
        ingredients,
        imageUrl: finalImageUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        likes: 0,
        tags: [],
        difficulty: "medium",
        // Keep reference to original draft
        originalDraftId: draftId,
      }

      // Save final recipe to recipes collection
      const recipeDocRef = await db.collection("recipes").add(recipeData)

      // Clean up: Delete the draft and temporary image
      await db.collection("recipeDrafts").doc(draftId).delete()
      await draftFile.delete().catch(console.error) // Don't fail if cleanup fails

      return res.status(201).json({
        success: true,
        message: "Recipe submitted successfully!",
        recipeId: recipeDocRef.id,
        imageUrl: finalImageUrl,
      } as SubmitRecipeResponse)
    } catch (error) {
      console.error("Error in submitRecipe Cloud Function:", error)
      return res.status(500).json({
        success: false,
        error: "SERVER_ERROR",
        message: "An internal server error occurred during recipe submission.",
      } as SubmitRecipeResponse)
    }
  })
})

// Optional: Cloud Function to clean up expired drafts (run as scheduled function)
export const cleanupExpiredDrafts = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  const now = admin.firestore.Timestamp.now()
  const expiredDraftsQuery = db.collection("recipeDrafts").where("expiresAt", "<=", now)

  const expiredDrafts = await expiredDraftsQuery.get()
  const batch = db.batch()
  const bucket = storage.bucket()

  for (const doc of expiredDrafts.docs) {
    const draftData = doc.data()

    // Delete the draft document
    batch.delete(doc.ref)

    // Delete the associated image file
    if (draftData.imagePath) {
      const file = bucket.file(draftData.imagePath)
      await file.delete().catch(console.error)
    }
  }

  await batch.commit()
  console.log(`Cleaned up ${expiredDrafts.size} expired recipe drafts`)
  return null
})
