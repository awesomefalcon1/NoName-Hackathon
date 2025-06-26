import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { storage, db } from "@/lib/firebase"
import type { UploadRecipeCompleteResponse, FirestoreRecord } from "@/models/api"

// Configure upload directories
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/recipes")
const DATABASE_FILE = path.join(process.cwd(), "data/recipes.json")
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  await fs.mkdir(path.dirname(DATABASE_FILE), { recursive: true })
}

// Read existing records from JSON file
async function readRecords(): Promise<FirestoreRecord[]> {
  try {
    const data = await fs.readFile(DATABASE_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return []
  }
}

// Write records to JSON file
async function writeRecords(records: FirestoreRecord[]): Promise<void> {
  await fs.writeFile(DATABASE_FILE, JSON.stringify(records, null, 2), "utf-8")
}

// Generate unique ID (simple implementation)
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2)}`
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header (optional, but recommended for production)
    const authHeader = request.headers.get("authorization")

    // Parse the multipart form data
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const imageFile = formData.get("image") as File
    const userId = formData.get("userId") as string // Optional user ID

    // Validate required fields
    if (!name || !description || !imageFile) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_FIELDS",
          message: "Name, description, and image file are required",
        } as UploadRecipeCompleteResponse,
        { status: 400 },
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_FILE_TYPE",
          message: "Please upload a valid image file (JPG, PNG, GIF, WebP)",
        } as UploadRecipeCompleteResponse,
        { status: 400 },
      )
    }

    // Validate file size (10MB limit)
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "FILE_TOO_LARGE",
          message: "Image file must be smaller than 10MB",
        } as UploadRecipeCompleteResponse,
        { status: 400 },
      )
    }

    console.log("Starting recipe upload process...")
    console.log("Recipe name:", name)
    console.log("Description length:", description.length)
    console.log("Image file:", imageFile.name, "Size:", imageFile.size, "Type:", imageFile.type)

    // Step 1: Upload image to Firebase Storage
    console.log("Step 1: Uploading image to Firebase Storage...")

    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await imageFile.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Create a unique filename
    const timestamp = Date.now()
    const fileExtension = imageFile.name.split(".").pop() || "jpg"
    const fileName = `recipe-${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`

    // Create storage reference
    const storageRef = ref(storage, `recipes/${fileName}`)

    // Upload the file
    const uploadResult = await uploadBytes(storageRef, fileBuffer, {
      contentType: imageFile.type,
    })

    console.log("Image uploaded successfully!")
    console.log("Storage path:", uploadResult.ref.fullPath)

    // Get the download URL
    const imageURL = await getDownloadURL(uploadResult.ref)
    console.log("Image download URL:", imageURL)

    // Step 2: Insert data into Firestore
    console.log("Step 2: Inserting data into Firestore...")

    // Prepare document data
    const docData = {
      name: name.trim(),
      imageURL: imageURL,
      imageKey: uploadResult.ref.fullPath, // This is the "key" in Firebase Storage
      description: description.trim(),
      createdAt: serverTimestamp(),
      ...(userId && { userId }), // Add userId if provided
      metadata: {
        originalFileName: imageFile.name,
        fileSize: imageFile.size,
        contentType: imageFile.type,
        uploadTimestamp: timestamp,
      },
    }

    console.log("Inserting data:", {
      ...docData,
      createdAt: "[ServerTimestamp]", // Don't log the actual timestamp object
    })

    // Add document to the "records" collection (matching your original function)
    const docRef = await addDoc(collection(db, "records"), docData)

    console.log("Document successfully written with ID:", docRef.id)

    // Ensure directories exist
    await ensureDirectories()

    // Step 3: Save image to local file system
    console.log("Step 3: Saving image to local file system...")

    // Generate unique filename
    const localFileName = `recipe-${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    const localFilePath = path.join(UPLOAD_DIR, localFileName)

    // Convert File to buffer and save
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    await fs.writeFile(localFilePath, buffer)

    console.log("Image saved successfully!")
    console.log("Local file path:", localFilePath)

    // Construct public URL for the image
    const localImageURL = `/uploads/recipes/${localFileName}`
    const localImageKey = `recipes/${localFileName}` // Relative path as "key"

    console.log("Image public URL:", localImageURL)

    // Step 4: Insert data into local JSON database
    console.log("Step 4: Inserting data into local JSON database...")

    // Generate unique document ID
    const localDocumentId = generateId()

    // Prepare document data
    const localDocData: FirestoreRecord = {
      id: localDocumentId,
      name: name.trim(),
      imageURL: localImageURL,
      imageKey: localImageKey,
      description: description.trim(),
      createdAt: new Date().toISOString(),
      ...(userId && { userId }),
      metadata: {
        originalFileName: imageFile.name,
        fileSize: imageFile.size,
        contentType: imageFile.type,
        uploadTimestamp: timestamp,
        localFilePath: localFilePath,
      },
    }

    console.log("Inserting data:", {
      ...localDocData,
      metadata: { ...localDocData.metadata, localFilePath: "[LOCAL_PATH]" }, // Don't log full path
    })

    // Read existing records
    const existingRecords = await readRecords()

    // Add new record
    existingRecords.push(localDocData)

    // Write back to file
    await writeRecords(existingRecords)

    console.log("Document successfully written with ID:", localDocumentId)
    console.log("Total records in database:", existingRecords.length)

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Recipe uploaded successfully!",
        data: {
          documentId: docRef.id,
          imageURL: imageURL,
          imageKey: uploadResult.ref.fullPath,
          name: name.trim(),
          description: description.trim(),
          localFilePath: localFilePath,
        },
      } as UploadRecipeCompleteResponse,
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in upload-recipe-complete API:", error)

    // Provide more specific error messages
    let errorMessage = "An internal server error occurred while uploading the recipe"
    let errorCode = "SERVER_ERROR"

    if (error instanceof Error) {
      if (error.message.includes("storage")) {
        errorMessage = "Failed to upload image to storage"
        errorCode = "STORAGE_ERROR"
      } else if (error.message.includes("firestore") || error.message.includes("addDoc")) {
        errorMessage = "Failed to save recipe data to database"
        errorCode = "DATABASE_ERROR"
      } else if (error.message.includes("ENOENT") || error.message.includes("permission")) {
        errorMessage = "Failed to save file to local storage"
        errorCode = "STORAGE_ERROR"
      } else if (error.message.includes("JSON") || error.message.includes("parse")) {
        errorMessage = "Failed to save recipe data to local database"
        errorCode = "DATABASE_ERROR"
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorCode,
        message: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
      } as UploadRecipeCompleteResponse,
      { status: 500 },
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
