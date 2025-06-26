import { type NextRequest, NextResponse } from "next/server"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { getApps } from "firebase-admin/app"
import type { UploadProfilePictureResponse } from "@/models/api"

// Initialize Firebase Admin (server-side)
if (!getApps().length) {
  // In production, you'd use service account credentials
  // For now, we'll use the client SDK approach
}

// Client-side Firebase config for storage operations
import { storage, db } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authorization token required",
        } as UploadProfilePictureResponse,
        { status: 401 },
      )
    }

    // For now, we'll extract userId from the token (in production, verify the token)
    const token = authHeader.split("Bearer ")[1]

    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get("profilePicture") as File
    const userId = formData.get("userId") as string

    if (!file || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_DATA",
          message: "Profile picture file and user ID are required",
        } as UploadProfilePictureResponse,
        { status: 400 },
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_FILE_TYPE",
          message: "Please upload a valid image file (JPG, PNG, GIF, WebP)",
        } as UploadProfilePictureResponse,
        { status: 400 },
      )
    }

    // Validate file size (5MB limit)
    const maxFileSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          success: false,
          error: "FILE_TOO_LARGE",
          message: "Profile picture must be smaller than 5MB",
        } as UploadProfilePictureResponse,
        { status: 400 },
      )
    }

    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Check if user has an existing profile picture to delete
    const userDocRef = doc(db, "users", userId)
    const userDoc = await getDoc(userDocRef)
    let oldPhotoPath: string | null = null

    if (userDoc.exists()) {
      const userData = userDoc.data()
      if (userData.photoPath) {
        oldPhotoPath = userData.photoPath
      }
    }

    // Create a reference for the new profile picture
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop() || "jpg"
    const fileName = `profile-${userId}-${timestamp}.${fileExtension}`
    const storageRef = ref(storage, `profilePictures/${fileName}`)

    // Upload the new file
    const uploadResult = await uploadBytes(storageRef, fileBuffer, {
      contentType: file.type,
    })

    console.log("Successfully uploaded profile picture!")
    console.log("File path in storage:", uploadResult.ref.fullPath)

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref)
    console.log("File available at:", downloadURL)

    // Update user document with new photo URL and path
    await updateDoc(userDocRef, {
      photoURL: downloadURL,
      photoPath: uploadResult.ref.fullPath,
      updatedAt: new Date(),
    })

    // Delete old profile picture if it exists
    if (oldPhotoPath) {
      try {
        const oldPhotoRef = ref(storage, oldPhotoPath)
        await deleteObject(oldPhotoRef)
        console.log("Successfully deleted old profile picture")
      } catch (deleteError) {
        console.error("Error deleting old profile picture:", deleteError)
        // Don't fail the request if we can't delete the old image
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile picture updated successfully!",
        photoURL: downloadURL,
        photoPath: uploadResult.ref.fullPath,
      } as UploadProfilePictureResponse,
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in upload-profile-picture API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An internal server error occurred while uploading the profile picture",
      } as UploadProfilePictureResponse,
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
