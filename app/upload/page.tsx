"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"

// Response type from your Firebase function
interface StoreRecipeResponse {
  id: string
  name: string
  description: string
  imagePath: string
}

function UploadRecipePageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [recipeName, setRecipeName] = useState("")
  const [recipeDescription, setRecipeDescription] = useState("")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [recipeImageUrl, setRecipeImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<StoreRecipeResponse | null>(null)

  // Replace with your actual Firebase Cloud Function URL
  const STORE_RECIPE_URL = "https://us-central1-aibridge-73844.cloudfunctions.net/storeRecepie"

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB limit)
      const maxFileSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxFileSize) {
        toast({
          title: "File Too Large",
          description: "Image file must be smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setRecipeImage(file)
      setRecipeImageUrl(URL.createObjectURL(file))
    }
  }

  const handleUploadRecipe = async (e: FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please sign in first.",
        variant: "destructive",
      })
      return
    }

    if (!recipeName.trim() || !recipeDescription.trim() || !recipeImage) {
      toast({
        title: "Missing Information",
        description: "Please provide recipe name, description, and image.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Temporary: Mock the API response for testing
      // Remove this when CORS is fixed
      const isDevelopment = process.env.NODE_ENV === "development"

      if (isDevelopment) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Mock successful response
        const mockResult: StoreRecipeResponse = {
          id: `mock-${Date.now()}`,
          name: recipeName.trim(),
          description: recipeDescription.trim(),
          imagePath: `mock/path/${recipeImage.name}`,
        }

        setUploadSuccess(mockResult)

        toast({
          title: "Recipe Uploaded Successfully! (Mock)",
          description: `Your recipe "${mockResult.name}" has been saved with ID: ${mockResult.id}`,
          variant: "success",
        })

        return
      }

      // Actual API call (when CORS is fixed)
      const formData = new FormData()
      formData.append("name", recipeName.trim())
      formData.append("description", recipeDescription.trim())
      formData.append("picture", recipeImage)

      const response = await fetch(STORE_RECIPE_URL, {
        method: "POST",
        body: formData,
        mode: "cors",
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        if (response.status === 405) {
          errorMessage = "Method not allowed. The API endpoint may have CORS restrictions."
        } else if (response.status === 0) {
          errorMessage = "Network error. This is likely a CORS issue with the API endpoint."
        }

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If we can't parse JSON, use the default message
        }

        throw new Error(errorMessage)
      }

      const result: StoreRecipeResponse = await response.json()
      setUploadSuccess(result)

      toast({
        title: "Recipe Uploaded Successfully!",
        description: `Your recipe "${result.name}" has been saved with ID: ${result.id}`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error uploading recipe:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not upload your recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadAnother = () => {
    // Reset form for another upload
    setRecipeName("")
    setRecipeDescription("")
    setRecipeImage(null)
    setRecipeImageUrl(null)
    setUploadSuccess(null)

    toast({
      title: "Ready for New Recipe",
      description: "You can now upload another recipe.",
    })
  }

  const handleViewRecipes = () => {
    router.push("/recipes")
  }

  if (uploadSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-white dark:bg-neutral-800">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">Recipe Uploaded Successfully!</CardTitle>
            <CardDescription>Your recipe has been saved and is now available in the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{uploadSuccess.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{uploadSuccess.description}</p>
              <p className="text-xs text-muted-foreground">Recipe ID: {uploadSuccess.id}</p>
              <p className="text-xs text-muted-foreground">Image Path: {uploadSuccess.imagePath}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleUploadAnother} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Another Recipe
              </Button>
              <Button onClick={handleViewRecipes} variant="outline" className="sm:w-auto">
                View All Recipes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto bg-white dark:bg-neutral-800">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <UploadCloud className="w-6 h-6 mr-2 text-yellow-500" />
            Upload Your Recipe
          </CardTitle>
          <CardDescription>Share your culinary creations with the NoName Recipes community.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadRecipe} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipeName">Recipe Name *</Label>
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="e.g., Grandma's Apple Pie"
                required
                disabled={isUploading}
                className="bg-gray-50 dark:bg-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipeDescription">Recipe Description *</Label>
              <Textarea
                id="recipeDescription"
                value={recipeDescription}
                onChange={(e) => setRecipeDescription(e.target.value)}
                placeholder="Describe your recipe, ingredients, and cooking instructions..."
                required
                rows={6}
                disabled={isUploading}
                className="bg-gray-50 dark:bg-neutral-700"
              />
              <p className="text-xs text-muted-foreground">
                Provide a detailed description including ingredients and cooking steps.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipeImage">Recipe Image *</Label>
              <Input
                id="recipeImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
                disabled={isUploading}
                className="bg-gray-50 dark:bg-neutral-700"
              />
              <p className="text-xs text-muted-foreground">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
              </p>

              {recipeImageUrl && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <Image
                    src={recipeImageUrl || "/placeholder.svg"}
                    alt="Recipe preview"
                    width={300}
                    height={200}
                    className="rounded-md object-cover border border-gray-200 dark:border-neutral-600"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Recipe...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Recipe
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UploadRecipePage() {
  return (
    <ProtectedRoute message="Please sign in to upload a recipe.">
      <UploadRecipePageContent />
    </ProtectedRoute>
  )
}
