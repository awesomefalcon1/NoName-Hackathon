"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { UploadCloud, Wand2, Edit3, CheckCircle, AlertTriangle, Loader2, PlusCircle, Trash2, Clock, ChefHat, Globe, Leaf } from "lucide-react"
n
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

import { storage, db } from "@/lib/firebase" // For Firebase storage and Firestore
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { aiService, type AIRecipeAnalysis, type AIIngredient, type AIProductMatch } from "@/lib/ai-service"

interface Ingredient {
  id: string
  name: string
  quantity: string
  storeProduct?: StoreProduct // Matched store product
}

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


  const devMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  if (devMode) {
    // skip auth checks or set a mock user
  }


  const [recipeName, setRecipeName] = useState("")
  const [recipeDescription, setRecipeDescription] = useState("")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [recipeImageUrl, setRecipeImageUrl] = useState<string | null>(null)

  const [briefIngredients, setBriefIngredients] = useState("")
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null)
  const [extractedIngredients, setExtractedIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditingRecipe, setIsEditingRecipe] = useState(false)
  const [editedRecipe, setEditedRecipe] = useState("")
  
  // New state for AI analysis
  const [aiAnalysis, setAiAnalysis] = useState<AIRecipeAnalysis | null>(null)


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


    setIsLoading(true)
    
    try {
      // Use AI service to analyze ingredients and generate recipe
      const analysis = await aiService.analyzeIngredients(briefIngredients, recipeName)
      setAiAnalysis(analysis)

      // Generate recipe using AI analysis
      const aiGeneratedRecipe = generateRecipeFromAnalysis(analysis, recipeName)
      setGeneratedRecipe(aiGeneratedRecipe)
      setEditedRecipe(aiGeneratedRecipe)

      // Convert AI ingredients to our format
      const ingredients: Ingredient[] = analysis.ingredients.map((aiIng, index) => ({
        id: `ing-${index}-${Date.now()}`,
        name: aiIng.name,
        quantity: `${aiIng.quantity} ${aiIng.unit}`,
        storeProduct: analysis.productMatches.find(match => match.category === aiIng.category) ? {
          id: analysis.productMatches.find(match => match.category === aiIng.category)!.id,
          name: analysis.productMatches.find(match => match.category === aiIng.category)!.name,
          price: analysis.productMatches.find(match => match.category === aiIng.category)!.price,
          imageUrl: analysis.productMatches.find(match => match.category === aiIng.category)!.imageUrl,
        } : undefined,
      }))
      
      setExtractedIngredients(ingredients)

      toast({
        title: "AI Recipe Generated!",
        description: "Our AI has analyzed your ingredients and generated a smart recipe with product matches.",
      })
    } catch (error) {
      console.error("Error generating recipe:", error)
      toast({
        title: "Generation Failed",
        description: "Could not generate recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateRecipeFromAnalysis = (analysis: AIRecipeAnalysis, recipeName: string): string => {
    const { ingredients, cookingTime, difficulty, cuisine, dietaryInfo } = analysis
    
    let recipe = `# ${recipeName}\n\n`
    recipe += `**Cuisine:** ${cuisine} | **Difficulty:** ${difficulty} | **Time:** ${cookingTime}\n`
    
    if (dietaryInfo.length > 0) {
      recipe += `**Dietary:** ${dietaryInfo.join(', ')}\n\n`
    }
    
    recipe += `## Ingredients\n`
    ingredients.forEach(ing => {
      recipe += `- ${ing.quantity} ${ing.unit} ${ing.name} (${ing.category})\n`
    })
    
    recipe += `\n## Instructions\n`
    recipe += `1. Prepare all ingredients as listed above.\n`
    recipe += `2. Follow standard cooking procedures for ${cuisine.toLowerCase()} cuisine.\n`
    recipe += `3. Cook for approximately ${cookingTime}.\n`
    recipe += `4. Season to taste and serve hot.\n\n`
    recipe += `**Tip:** This ${difficulty.toLowerCase()} recipe is perfect for ${cuisine.toLowerCase()} cuisine lovers!`
    
    return recipe
  }

  const handleEditIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setExtractedIngredients((prev) => prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)))
  }


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

        return ing
      }),
    )
    toast({ title: "Ingredient Swapped!", variant: "default" })
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

        title: "Recipe Submitted!",
        description: `Your recipe "${recipeName}" is now live! Doc ID: ${docRef.id}`,
        variant: "default",

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


  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload a recipe.",
        variant: "destructive",
      })
      router.push("/signin")
    }
  }, [user, authLoading, router])

  if (authLoading) {

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


          {generatedRecipe && (
            <div className="space-y-6 pt-6 border-t dark:border-neutral-700">
              {/* AI Analysis Summary */}
              {aiAnalysis && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Wand2 className="w-5 h-5 mr-2 text-yellow-600" />
                    AI Analysis Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Cooking Time</p>
                        <p className="font-medium">{aiAnalysis.cookingTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ChefHat className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Difficulty</p>
                        <p className="font-medium">{aiAnalysis.difficulty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Cuisine</p>
                        <p className="font-medium">{aiAnalysis.cuisine}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Dietary</p>
                        <p className="font-medium">
                          {aiAnalysis.dietaryInfo.length > 0 
                            ? aiAnalysis.dietaryInfo.join(', ') 
                            : 'Standard'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                  AI-Enhanced Ingredients
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Our AI has intelligently parsed your ingredients and matched them with NoName products.
                </p>
                <div className="space-y-3">
                  {extractedIngredients.map((ing) => {
                    const aiIngredient = aiAnalysis?.ingredients.find(ai => ai.name === ing.name)
                    return (
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
                            {aiIngredient && (
                              <div className="text-xs text-muted-foreground">
                                <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mr-2">
                                  {aiIngredient.category}
                                </span>
                                <span>{aiIngredient.description}</span>
                              </div>
                            )}
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
                    )
                  })}
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
