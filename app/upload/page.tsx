"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, Wand2, Loader2 } from "lucide-react"
import { ToastManager } from "@/lib/toast-manager"
import Image from "next/image"

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
  const [recipeName, setRecipeName] = useState("")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [recipeImageUrl, setRecipeImageUrl] = useState<string | null>(null)
  const [briefIngredients, setBriefIngredients] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setRecipeImage(file)
      setRecipeImageUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmission = async (e: FormEvent) => {
    e.preventDefault()
    if (!recipeName || !recipeImage || !briefIngredients) {
      ToastManager.error("Missing Information", "Please provide recipe name, image, and brief ingredients.")
      return
    }

    setIsLoading(true)
    
    // Access individual state values
    console.log("Recipe Name:", recipeName)
    console.log("Recipe Image:", recipeImage)
    console.log("Brief Ingredients:", briefIngredients)
    
    // You can now use recipeName, recipeImage, and briefIngredients individually
    // For example, send to API:
    // const response = await fetch('/api/upload-recipe', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     name: recipeName,
    //     image: recipeImage,
    //     ingredients: briefIngredients
    //   })
    // })
    
    // Simulate recipe generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    
    ToastManager.success("Recipe Generated!", `Your recipe "${recipeName}" has been generated successfully!`)
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
          <form onSubmit={handleSubmission} className="space-y-4">
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
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Upload Recipe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}