// Test script for the local upload API
// Run with: node scripts/test-local-upload.js

import fetch from "node-fetch"
import FormData from "form-data"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testLocalUploadAPI() {
  try {
    console.log("Testing Local Recipe Upload API...")

    // API endpoint
    const apiUrl = "http://localhost:3000/api/upload-recipe-complete"

    // Create form data
    const formData = new FormData()
    formData.append("name", "Local Test Recipe")
    formData.append(
      "description",
      "This is a test recipe uploaded to local file system. It demonstrates saving images locally and storing data in a JSON file.",
    )
    formData.append("userId", "local-test-user-123") // Optional

    // Create a test image file if it doesn't exist
    const imagePath = path.join(__dirname, "test-image.txt")
    if (!fs.existsSync(imagePath)) {
      console.log("Creating test file...")
      fs.writeFileSync(imagePath, "This is a test file for local upload")
    }

    // For a real test, you should use an actual image file
    // const imagePath = path.join(__dirname, "test-image.jpg")
    formData.append("image", fs.createReadStream(imagePath))

    // Make the API request
    console.log("Sending request to:", apiUrl)
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    console.log("Response Status:", response.status)
    console.log("Response Body:", JSON.stringify(result, null, 2))

    if (result.success) {
      console.log("✅ Upload successful!")
      console.log("Document ID:", result.data.documentId)
      console.log("Image URL:", result.data.imageURL)
      console.log("Image Key:", result.data.imageKey)
      console.log("Local File Path:", result.data.localFilePath)

      // Test getting the uploaded recipe
      await testGetRecipe(result.data.documentId)
      await testGetAllRecipes()
    } else {
      console.log("❌ Upload failed:", result.message)
    }
  } catch (error) {
    console.error("Error testing API:", error)
  }
}

async function testGetRecipe(id) {
  try {
    console.log("\n--- Testing Get Single Recipe ---")
    const response = await fetch(`http://localhost:3000/api/get-recipe/${id}`)
    const result = await response.json()

    console.log("Get Recipe Response:", JSON.stringify(result, null, 2))
  } catch (error) {
    console.error("Error getting recipe:", error)
  }
}

async function testGetAllRecipes() {
  try {
    console.log("\n--- Testing Get All Recipes ---")
    const response = await fetch("http://localhost:3000/api/get-recipes?limit=5")
    const result = await response.json()

    console.log("Get All Recipes Response:", JSON.stringify(result, null, 2))
  } catch (error) {
    console.error("Error getting recipes:", error)
  }
}

// Run the test
testLocalUploadAPI()
