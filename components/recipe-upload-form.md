"use client"

import type React from "react"

import { useState, useRef, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, Loader2, CheckCircle } from "lucide-react"
import { ToastManager } from "@/lib/toast-manager"
import Image from "next/image"
import type { UploadRecipeCompleteResponse } from "@/models/api"

interface RecipeUploadFormProps {
  userId?: string
  onSuccess?: (result: UploadRecipeCompleteResponse) => void
}

export default function RecipeUploadForm({ userId, onSuccess }: RecipeUploadFormProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [recipeName, setRecipeName] = useState("")
  const [recipeDescription, setRecipeDescription] = useState("")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [recipeImageUrl, setRecipeImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadRecipeCompleteResponse | null>(null)

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

      // Validate file size (10MB limit)
      const maxFileSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxFileSize) {
        toast({
          title: "File Too Large",
          description: "Image file must be smaller than 10MB.",
          variant: "destructive",
        })
        return
      }

      setRecipeImage(file)
      setRecipeImageUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

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
      // Create form data
      const formData = new FormData()
      formData.append("name", recipeName.trim())
      formData.append("description", recipeDescription.trim())
      formData.append("image", recipeImage)
      if (userId) {
        formData.append("userId", userId)
      }

      // Upload to our API
      const response = await fetch("/api/upload-recipe-complete", {
        method: "POST",
        body: formData,
      })

      const result: UploadRecipeCompleteResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to upload recipe")
      }

      setUploadResult(result)

      toast({
        title: "Recipe Uploaded Successfully!",
        description: `Your recipe "${result.data?.name}" has been saved to the database.`,
        variant: "default",
      })

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result)
      }

      // Reset form
      setRecipeName("")
      setRecipeDescription("")
      setRecipeImage(null)
      setRecipeImageUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading recipe:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not upload recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (uploadResult) {
    return (
      <Card className="max-w-2xl mx-auto bg-white dark:bg-neutral-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-600 dark:text-green-400">Recipe Uploaded Successfully!</CardTitle>
          <CardDescription>Your recipe has been saved to the database with image storage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{uploadResult.data?.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{uploadResult.data?.description}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>Document ID:</strong> {uploadResult.data?.documentId}
              </p>
              <p>
                <strong>Image Key:</strong> {uploadResult.data?.imageKey}
              </p>
              <p>
                <strong>Image URL:</strong>{" "}
                <a
                  href={uploadResult.data?.imageURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Image
                </a>
              </p>
            </div>
          </div>

          <Button onClick={() => setUploadResult(null)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Another Recipe
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white dark:bg-neutral-800">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <UploadCloud className="w-6 h-6 mr-2 text-yellow-500" />
          Upload Recipe to Database
        </CardTitle>
        <CardDescription>
          Upload your recipe with image to Firebase Storage and save data to Firestore database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              ref={fileInputRef}
              id="recipeImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
              disabled={isUploading}
              className="bg-gray-50 dark:bg-neutral-700"
            />
            <p className="text-xs text-muted-foreground">
              Maximum file size: 10MB. Supported formats: JPG, PNG, GIF, WebP
            </p>

            {recipeImageUrl && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="relative w-full h-48 border border-gray-200 dark:border-neutral-600 rounded-md overflow-hidden">
                  <Image
                    src={recipeImageUrl || "/placeholder.svg"}
                    alt="Recipe preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading Recipe...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Recipe to Database
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
