import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import { v4 as uuidv4 } from "uuid"
import * as Busboy from "busboy"
import type { RecipeIngredient, UploadRecipeResponse } from "../../models" // Adjust path as needed

// Initialize Firebase Admin SDK
admin.initializeApp()
const db = admin.firestore()
const storage = admin.storage()

// Define CORS options
const cors = require("cors")({ origin: true })

export const uploadRecipe = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "METHOD_NOT_ALLOWED",
        message: "Only POST requests are allowed.",
      } as UploadRecipeResponse)
    }

    // 1. Authenticate user using Firebase ID Token
    const idToken = req.headers.authorization?.split("Bearer ")[1]
    if (!idToken) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "Authentication token missing.",
      } as UploadRecipeResponse)
    }

    let decodedToken: admin.auth.DecodedIdToken
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken)
    } catch (error) {
      console.error("Error verifying ID token:", error)
      return res.status(401).json({
        success: false,
        error: "INVALID_TOKEN",
        message: "Invalid or expired authentication token.",
        details: error instanceof Error ? error.message : "Unknown token error",
      } as UploadRecipeResponse)
    }

    const userId = decodedToken.uid
    const userName = decodedToken.name || decodedToken.email || "Anonymous Chef" // Use display name if available

    const busboy = Busboy({ headers: req.headers })
    const fields: { [key: string]: any } = {}
    let fileBuffer: Buffer | null = null
    let fileMimeType: string | null = null
    let originalFileName: string | null = null

    const fileUploadPromise = new Promise<void>((resolve, reject) => {
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
          resolve()
        })
        file.on("error", reject)
      })

      busboy.on("field", (fieldname, val) => {
        fields[fieldname] = val
      })

      busboy.on("finish", () => {
        resolve() // Resolve if no file or fields are processed
      })

      busboy.on("error", reject)

      req.pipe(busboy)
    })

    try {
      await fileUploadPromise

      const { recipeName, briefIngredients, fullRecipe, ingredients: ingredientsString } = fields

      // Basic validation of received fields
      if (!recipeName || !briefIngredients || !fullRecipe || !ingredientsString || !fileBuffer || !fileMimeType) {
        return res.status(400).json({
          success: false,
          error: "MISSING_FIELDS",
          message: "Missing required recipe information or image.",
        } as UploadRecipeResponse)
      }

      // Validate file type and size (server-side validation)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      const maxFileSize = 5 * 1024 * 1024 // 5MB

      if (!fileMimeType || !allowedTypes.includes(fileMimeType)) {
        return res.status(400).json({
          success: false,
          error: "INVALID_FILE_TYPE",
          message: "Please upload a valid image file (JPG, PNG, GIF, WebP).",
        } as UploadRecipeResponse)
      }
      if (fileBuffer.length > maxFileSize) {
        return res.status(400).json({
          success: false,
          error: "FILE_TOO_LARGE",
          message: "Image file must be smaller than 5MB.",
        } as UploadRecipeResponse)
      }

      // 2. Upload image to Firebase Storage
      const bucket = storage.bucket()
      const imageFileName = `${userId}/${uuidv4()}-${originalFileName}`
      const file = bucket.file(`recipeImages/${imageFileName}`)

      await file.save(fileBuffer, {
        metadata: {
          contentType: fileMimeType,
          // Add custom metadata if needed, e.g., { custom: 'metadata' }
        },
      })

      const [imageUrl] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491", // A far future date for effectively public read access
      })

      // 3. Parse ingredients string
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
          details: e instanceof Error ? e.message : "Unknown parsing error",
        } as UploadRecipeResponse)
      }

      // 4. Prepare recipe data for Firestore
      const recipeData = {
        userId,
        userName,
        recipeName,
        briefIngredients,
        fullRecipe,
        ingredients,
        imageUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        likes: 0,
        tags: [],
        difficulty: "medium",
      }

      // 5. Save recipe data to Firestore
      const docRef = await db.collection("recipes").add(recipeData)

      return res.status(201).json({
        success: true,
        message: "Recipe uploaded successfully!",
        recipeId: docRef.id,
        imageUrl: imageUrl,
      } as UploadRecipeResponse)
    } catch (error) {
      console.error("Error in uploadRecipe Cloud Function:", error)
      return res.status(500).json({
        success: false,
        error: "SERVER_ERROR",
        message: "An internal server error occurred during recipe upload.",
        details: error instanceof Error ? error.message : "Unknown server error",
      } as UploadRecipeResponse)
    }
  })
})
