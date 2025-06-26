"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, Wand2, Edit3, CheckCircle, AlertTriangle, Loader2, PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"

// Types for the API responses
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

interface SubmitRecipeResponse {
  success: boolean
  message: string
  recipeId?: string
  imageUrl?: string
  error?: string
  details?: string
}

function UploadRecipePageContent() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [recipeName, setRecipeName] = useState("")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [recipeImageUrl, setRecipeImageUrl] = useState<string | null>(null)
  const [briefDescription, setBriefDescription] = useState("")
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null)
  const [extractedIngredients, setExtractedIngredients] = useState<ExtractedIngredient[]>([])
  const [draftId, setDraftId] = useState<string | null>(null) // Store the draft ID
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditingRecipe, setIsEditingRecipe] = useState(false)
  const [editedRecipe, setEditedRecipe] = useState("")

  // Replace with your actual Firebase Cloud Function URLs
  const GENERATE_RECIPE_URL = "YOUR_FIREBASE_CLOUD_FUNCTION_URL/generateRecipe" // <<< UPDATE THIS
  const SUBMIT_RECIPE_URL = "YOUR_FIREBASE_CLOUD_FUNCTION_URL/submitRecipe" // <<< UPDATE THIS

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

  const handleGenerateRecipe = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: "Not Authenticated", description: "Please sign in first.", variant: "destructive" })
      return
    }
    if (!recipeName || !recipeImage || !briefDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide recipe name, image, and brief description.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Get the Firebase ID token for authentication
      const idToken = await user.getIdToken()

      // Prepare form data for the generate recipe API
      const formData = new FormData()
      formData.append("name", recipeName)
      formData.append("briefDescription", briefDescription)
      formData.append("recipeImage", recipeImage)

      const response = await fetch(GENERATE_RECIPE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      })

      const result: GenerateRecipeResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || result.message || "Generation failed")
      }

      if (result.data) {
        setDraftId(result.data.draftId) // Store the draft ID for later submission
        setGeneratedRecipe(result.data.generatedRecipe)
        setEditedRecipe(result.data.generatedRecipe)
        setExtractedIngredients(result.data.extractedIngredients)
        // Update the image URL to use the stored version
        setRecipeImageUrl(result.data.imageUrl)

        toast({
          title: "Recipe Generated & Saved!",
          description: "Review the recipe and ingredients below, then submit when ready.",
        })
      }
    } catch (error) {
      console.error("Error generating recipe:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Could not generate your recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditIngredient = (id: string, field: keyof ExtractedIngredient, value: string) => {
    setExtractedIngredients((prev) => prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)))
  }

  const handleSwapIngredient = async (ingredientId: string) => {
    toast({ title: "Swapping...", description: "Finding similar products..." })
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setExtractedIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === ingredientId) {
          return {
            ...ing,
            storeProduct: {
              id: `swapped-${Date.now()}`,
              name: `NoName Alt ${ing.name}`,
              price: `$${(Math.random() * 6 + 2).toFixed(2)}`,
              imageUrl: `/placeholder.svg?width=50&height=50&text=Alt`,
            },
          }
        }
        return ing
      }),
    )
    toast({ title: "Ingredient Swapped!", variant: "success" })
  }

  const handleRemoveIngredient = (id: string) => {
    setExtractedIngredients((prev) => prev.filter((ing) => ing.id !== id))
  }

  const handleAddIngredient = () => {
    setExtractedIngredients((prev) => [...prev, { id: `new-${Date.now()}`, name: "", quantity: "" }])
  }

  const handleSubmitRecipe = async () => {
    if (!user) {
      toast({ title: "Not Authenticated", description: "Please sign in first.", variant: "destructive" })
      return
    }
    if (!draftId || !editedRecipe || extractedIngredients.length === 0 || !recipeName) {
      toast({
        title: "Incomplete Recipe",
        description: "Ensure recipe name, recipe steps, and ingredients are set.",
        variant: "destructive",
      })
      return
    }

    // Validate ingredients
    const invalidIngredients = extractedIngredients.filter((ing) => !ing.name.trim() || !ing.quantity.trim())
    if (invalidIngredients.length > 0) {
      toast({
        title: "Invalid Ingredients",
        description: "Please ensure all ingredients have both name and quantity.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Get the Firebase ID token for authentication
      const idToken = await user.getIdToken()

      // Prepare form data for the submit recipe API (no image needed, using draft)
      const formData = new FormData()
      formData.append("draftId", draftId)
      formData.append("recipeName", recipeName)
      formData.append("briefIngredients", briefDescription)
      formData.append("fullRecipe", editedRecipe)
      formData.append(
        "ingredients",
        JSON.stringify(
          extractedIngredients.map((ing) => ({
            name: ing.name,
            quantity: ing.quantity,
            storeProductId: ing.storeProduct?.id || null,
            storeProductName: ing.storeProduct?.name || null,
            storeProductPrice: ing.storeProduct?.price || null,
            storeProductImageUrl: ing.storeProduct?.imageUrl || null,
          })),
        ),
      )

      const response = await fetch(SUBMIT_RECIPE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      })

      const result: SubmitRecipeResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || result.message || "Submission failed")
      }

      toast({
        title: "Recipe Submitted Successfully!",
        description: `Your recipe "${recipeName}" is now live! Recipe ID: ${result.recipeId}`,
        variant: "success",
      })

      // Reset form
      setRecipeName("")
      setRecipeImage(null)
      setRecipeImageUrl(null)
      setBriefDescription("")
      setGeneratedRecipe(null)
      setEditedRecipe("")
      setExtractedIngredients([])
      setDraftId(null)
      setIsEditingRecipe(false)

      if (result.recipeId) {
        router.push(`/recipes/${result.recipeId}`)
      }
    } catch (error) {
      console.error("Error submitting recipe:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Could not submit your recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto bg-white dark:bg-neutral-800">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <UploadCloud className="w-6 h-6 mr-2 text-yellow-500" />
            Upload Your Recipe
          </CardTitle>
          <CardDescription>Share your culinary creations and let our AI help with the details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleGenerateRecipe} className="space-y-4">
            <div>
              <Label htmlFor="recipeName">Recipe Name</Label>
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="e.g., Grandma's Apple Pie"
                required
                disabled={!!generatedRecipe} // Disable after generation
              />
            </div>
            <div>
              <Label htmlFor="recipeImage">Recipe Image</Label>
              <Input
                id="recipeImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
                disabled={!!generatedRecipe} // Disable after generation
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
              </p>
              {recipeImageUrl && (
                <div className="mt-2">
                  <Image
                    src={recipeImageUrl || "/placeholder.svg"}
                    alt="Recipe preview"
                    width={200}
                    height={150}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="briefDescription">Brief Description</Label>
              <Textarea
                id="briefDescription"
                value={briefDescription}
                onChange={(e) => setBriefDescription(e.target.value)}
                placeholder="e.g., Chicken breast, pasta, tomato sauce, cheese"
                required
                rows={3}
                disabled={!!generatedRecipe} // Disable after generation
              />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated list of main ingredients.</p>
            </div>
            {!generatedRecipe && (
              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Recipe & Ingredients
              </Button>
            )}
          </form>

          {generatedRecipe && (
            <div className="space-y-6 pt-6 border-t dark:border-neutral-700">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✅ Recipe draft saved! You can now review, edit, and submit when ready.
                  {draftId && <span className="block text-xs mt-1">Draft ID: {draftId}</span>}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Generated Recipe
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingRecipe(!isEditingRecipe)}>
                    <Edit3 className="w-4 h-4 mr-1" /> {isEditingRecipe ? "Save" : "Edit"}
                  </Button>
                </div>
                {isEditingRecipe ? (
                  <Textarea
                    value={editedRecipe}
                    onChange={(e) => setEditedRecipe(e.target.value)}
                    rows={10}
                    className="bg-gray-50 dark:bg-neutral-700"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-md whitespace-pre-wrap text-sm">
                    {editedRecipe}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Extracted Ingredients
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Review and edit the ingredients. Our AI tried to match them with NoName products.
                </p>
                <div className="space-y-3">
                  {extractedIngredients.map((ing) => (
                    <Card key={ing.id} className="p-3 bg-gray-50 dark:bg-neutral-700/50">
                      <div className="flex flex-col sm:flex-row gap-2 items-start">
                        <div className="flex-grow space-y-1">
                          <Input
                            value={ing.name}
                            onChange={(e) => handleEditIngredient(ing.id, "name", e.target.value)}
                            placeholder="Ingredient Name"
                            className="text-sm"
                          />
                          <Input
                            value={ing.quantity}
                            onChange={(e) => handleEditIngredient(ing.id, "quantity", e.target.value)}
                            placeholder="Quantity (e.g. 2 cups)"
                            className="text-sm"
                          />
                        </div>
                        <div className="sm:w-48 flex-shrink-0">
                          {ing.storeProduct ? (
                            <div className="flex items-center space-x-2 p-2 border dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800">
                              <Image
                                src={ing.storeProduct.imageUrl || "/placeholder.svg"}
                                alt={ing.storeProduct.name}
                                width={30}
                                height={30}
                                className="rounded"
                              />
                              <div className="text-xs">
                                <p className="font-medium">{ing.storeProduct.name}</p>
                                <p className="text-muted-foreground">{ing.storeProduct.price}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 p-2 border border-dashed dark:border-neutral-600 rounded-md text-xs text-muted-foreground">
                              <AlertTriangle className="w-4 h-4 text-orange-400" />
                              <span>No match found</span>
                            </div>
                          )}
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleSwapIngredient(ing.id)}
                            className="text-xs text-yellow-600 dark:text-yellow-500 p-1"
                          >
                            Swap Product
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveIngredient(ing.id)}
                          className="text-red-500 hover:text-red-600 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddIngredient}
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Ingredient
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSubmitRecipe}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Confirm & Submit Recipe
              </Button>
            </div>
          )}
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
