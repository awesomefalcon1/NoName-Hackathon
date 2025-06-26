"use client"

import RecipeUploadForm from "@/components/recipe-upload-form"
import type { UploadRecipeCompleteResponse } from "@/models/api"

export default function TestUploadPage() {
  const handleUploadSuccess = (result: UploadRecipeCompleteResponse) => {
    console.log("Upload successful:", result)
    // You can add additional logic here, like redirecting or updating state
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-4">Test Recipe Upload API</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This page demonstrates the complete recipe upload flow: image upload to Firebase Storage and data insertion
            to Firestore database.
          </p>
        </div>

        <RecipeUploadForm userId="test-user-123" onSuccess={handleUploadSuccess} />

        <div className="mt-12 p-6 bg-gray-50 dark:bg-neutral-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">API Details</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Endpoint:</strong> <code>/api/upload-recipe-complete</code>
            </p>
            <p>
              <strong>Method:</strong> POST
            </p>
            <p>
              <strong>Content-Type:</strong> multipart/form-data
            </p>
            <p>
              <strong>Fields:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <code>name</code> - Recipe name (required)
              </li>
              <li>
                <code>description</code> - Recipe description (required)
              </li>
              <li>
                <code>image</code> - Image file (required)
              </li>
              <li>
                <code>userId</code> - User ID (optional)
              </li>
            </ul>
            <p>
              <strong>Database Collection:</strong> <code>records</code>
            </p>
            <p>
              <strong>Storage Path:</strong> <code>recipes/</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
