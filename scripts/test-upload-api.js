// Test script for the upload API
// Run with: node scripts/test-upload-api.js

import fetch from "node-fetch"
import FormData from "form-data"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testUploadAPI() {
  try {
    console.log("Testing Recipe Upload API...")

    // API endpoint
    const apiUrl = "http://localhost:3000/api/upload-recipe-complete"

    // Create form data
    const formData = new FormData()
    formData.append("name", "Test Recipe from API")
    formData.append(
      "description",
      "This is a test recipe uploaded via the API endpoint. It includes a sample image and demonstrates the complete upload flow.",
    )
    formData.append("userId", "test-user-123") // Optional

    // Add a test image file (you'll need to create this or modify the path)
    const imagePath = path.join(__dirname, "test-image.jpg")

    // Check if test image exists, if not create a placeholder
    if (!fs.existsSync(imagePath)) {
      console.log("Test image not found, creating placeholder...")
      // Create a simple text file as placeholder (you should use a real image)
      fs.writeFileSync(imagePath.replace(".jpg", ".txt"), "This is a test file placeholder")
      console.log("Please add a real image file at:", imagePath)
      return
    }

    formData.append("image", fs.createReadStream(imagePath))

    // Make the API request
    console.log("Sending request to:", apiUrl)
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type header, let FormData set it with boundary
        Authorization: "Bearer test-token-123", // Optional
      },
    })

    const result = await response.json()

    console.log("Response Status:", response.status)
    console.log("Response Body:", JSON.stringify(result, null, 2))

    if (result.success) {
      console.log("✅ Upload successful!")
      console.log("Document ID:", result.data.documentId)
      console.log("Image URL:", result.data.imageURL)
      console.log("Image Key:", result.data.imageKey)
    } else {
      console.log("❌ Upload failed:", result.message)
    }
  } catch (error) {
    console.error("Error testing API:", error)
  }
}

// Run the test
testUploadAPI()
