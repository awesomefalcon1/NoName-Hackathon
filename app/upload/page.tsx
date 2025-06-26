"use client"

import type React from "react"
import { useState, type FormEvent } from "react" // Removed useEffect as ProtectedRoute handles it
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
import ProtectedRoute from "@/components/protected-route" // Import ProtectedRoute

interface Ingredient {
  id: string
  name: string
  quantity: string
  storeProduct?: StoreProduct
}

interface StoreProduct {
  id: string
  name: string
  price: string
  imageUrl: string
}

function UploadRecipePageContent() {
  const { user, userProfile } = useAuth() // authLoading is handled by ProtectedRoute
  const router = useRouter()
  const { toast } = useToast()

  const [recipeName, setRecipeName] = useState("")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [recipeImageUrl, setRecipeImageUrl] = useState<string | null>(null)
  const [briefIngredients, setBriefIngredients] = useState("")
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null)
  const [extractedIngredients, setExtractedIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditingRecipe, setIsEditingRecipe] = useState(false)
  const [editedRecipe, setEditedRecipe] = useState("")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
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
    if (!recipeName || !recipeImage || !briefIngredients) {
      toast({
        title: "Missing Information",
        description: "Please provide recipe name, image, and brief ingredients.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const mockGeneratedRecipe = `
1. Prepare your ingredients: ${briefIngredients}.
2. Cook the main components.
3. Combine all ingredients.
4. Season to taste.
5. Serve hot and enjoy your ${recipeName}!
  `.trim()
    setGeneratedRecipe(mockGeneratedRecipe)
    setEditedRecipe(mockGeneratedRecipe)
    const mockIngredients: Ingredient[] = briefIngredients.split(",").map((ing, index) => ({
      id: `ing-${index}-${Date.now()}`,
      name: ing.trim(),
      quantity: "1 unit",
      storeProduct:
        Math.random() > 0.3
          ? {
              id: `prod-${index}-${Date.now()}`,
              name: `NoName ${ing.trim()}`,
              price: `\$${(Math.random() * 5 + 1).toFixed(2)}`,
              imageUrl: `/placeholder.svg?width=50&height=50&text=${ing.trim().charAt(0)}`,
            }
          : undefined,
    }))
    setExtractedIngredients(mockIngredients)
    setIsLoading(false)
    toast({
      title: "Recipe Generated!",
      description: "Review the recipe and ingredients below.",
    })
  }

  const handleEditIngredient = (id: string, field: keyof Ingredient, value: string) => {
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
              price: `\$${(Math.random() * 6 + 2).toFixed(2)}`,
              imageUrl: `/placeholder.svg?width=50&height=50&text=Alt`,
            },
          }
        }
        return ing
      }),
    )
    toast({ title: "Ingredient Swapped!" })
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
    if (!recipeImage || !editedRecipe || extractedIngredients.length === 0 || !recipeName) {
      toast({
        title: "Incomplete Recipe",
        description: "Ensure recipe name, image, recipe steps, and ingredients are set.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append("userId", user.uid)
    formData.append(
      "userName",
      userProfile?.firstName
        ? `${userProfile.firstName} ${userProfile.lastName || ""}`.trim()
        : user.email || "Anonymous Chef",
    )
    formData.append("recipeName", recipeName)
    formData.append("briefIngredients", briefIngredients) // Send original brief ingredients
    formData.append("fullRecipe", editedRecipe) // Send the (potentially edited) full recipe steps
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
    formData.append("recipeImage", recipeImage)

    try {
      const response = await fetch("/api/uploadrecipe", {
        method: "POST",
        body: formData,
        // Headers are not typically needed for FormData with fetch, browser sets Content-Type
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `API Error: ${response.statusText}`)
      }

      setIsLoading(false)
      toast({
        title: "Recipe Submitted via API!",
        description: `Your recipe "${recipeName}" is now live! Recipe ID: ${result.recipeId}`,
        variant: "default",
      })

      // Reset form
      setRecipeName("")
      setRecipeImage(null)
      setRecipeImageUrl(null)
      setBriefIngredients("")
      setGeneratedRecipe(null) // Also reset the AI generated part
      setEditedRecipe("")
      setExtractedIngredients([])
      setIsEditingRecipe(false)
      router.push(`/recipes/${result.recipeId}`) // Optionally redirect
    } catch (error) {
      setIsLoading(false)
      console.error("Error submitting recipe via API:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Could not submit your recipe. Please try again.",
        variant: "destructive",
      })
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
              />
            </div>
            <div>
              <Label htmlFor="recipeImage">Recipe Image</Label>
              <Input id="recipeImage" type="file" accept="image/*" onChange={handleImageUpload} required />
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
              <Label htmlFor="briefIngredients">Brief Ingredients</Label>
              <Textarea
                id="briefIngredients"
                value={briefIngredients}
                onChange={(e) => setBriefIngredients(e.target.value)}
                placeholder="e.g., Chicken breast, pasta, tomato sauce, cheese"
                required
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated list of main ingredients.</p>
            </div>
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isLoading}>
              {isLoading && !generatedRecipe ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Recipe & Ingredients
            </Button>
          </form>

          {generatedRecipe && (
            <div className="space-y-6 pt-6 border-t dark:border-neutral-700">
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
                disabled={isLoading}
              >
                {isLoading ? (
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
