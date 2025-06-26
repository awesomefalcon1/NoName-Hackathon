"use client"

import type React from "react"

import { useState, type FormEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, Wand2, Edit3, CheckCircle, AlertTriangle, Loader2, PlusCircle, Trash2, Clock, ChefHat, Globe, Leaf } from "lucide-react"
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

interface StoreProduct {
  id: string
  name: string
  price: string
  imageUrl: string
}

export default function UploadRecipePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const devMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  if (devMode) {
    // skip auth checks or set a mock user
  }

  const [recipeName, setRecipeName] = useState("")
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

  const handleSwapIngredient = async (ingredientId: string) => {
    // Simulate AI vector search for similar products
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
    toast({ title: "Ingredient Swapped!", variant: "default" })
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
    if (!recipeImage || !generatedRecipe || extractedIngredients.length === 0) {
      toast({
        title: "Incomplete Recipe",
        description: "Ensure image, recipe steps, and ingredients are set.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // 1. Upload image to Firebase Storage
      const imageRef = ref(storage, `recipeImages/${user.uid}/${Date.now()}_${recipeImage.name}`)
      const snapshot = await uploadBytes(imageRef, recipeImage)
      const imageUrl = await getDownloadURL(snapshot.ref)

      // 2. Prepare recipe data for Firestore
      const recipeData = {
        userId: user.uid,
        userName: user.displayName || user.email, // Or use profile name from AuthContext
        recipeName,
        briefIngredients, // Store the original brief ingredients
        fullRecipe: editedRecipe, // Store the (potentially edited) full recipe
        ingredients: extractedIngredients.map((ing) => ({
          // Store structured ingredients
          name: ing.name,
          quantity: ing.quantity,
          storeProductId: ing.storeProduct?.id || null, // Link to store product if matched
          storeProductName: ing.storeProduct?.name || null,
        })),
        imageUrl,
        createdAt: serverTimestamp(),
        likes: 0,
        // comments: [], // You might want an array or subcollection for comments
      }

      // 3. Add recipe to Firestore
      const docRef = await addDoc(collection(db, "recipes"), recipeData)

      setIsLoading(false)
      toast({
        title: "Recipe Submitted!",
        description: `Your recipe "${recipeName}" is now live! Doc ID: ${docRef.id}`,
        variant: "default",
      })
      // Reset form or redirect
      setRecipeName("")
      setRecipeImage(null)
      setRecipeImageUrl(null)
      setBriefIngredients("")
      setGeneratedRecipe(null)
      setExtractedIngredients([])
      setIsEditingRecipe(false)
      router.push(`/recipes/${docRef.id}`) // Optionally redirect to the new recipe page
    } catch (error) {
      setIsLoading(false)
      console.error("Error submitting recipe:", error)
      toast({
        title: "Submission Failed",
        description: "Could not submit your recipe. Please try again.",
        variant: "destructive",
      })
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
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
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
