"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ChefHat, Clock, Users, Utensils, Loader2, Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

interface Recipe {
  title: string
  description: string
  cookTime: string
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
  tips?: string[]
}

export default function GeneratedRecipePage() {
  const [ingredients, setIngredients] = useState("")
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "Missing Ingredients",
        description: "Please enter some ingredients to generate a recipe.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a professional chef assistant. Generate a complete recipe based on the given ingredients. Return the response as a JSON object with the following structure: { "title": "Recipe Name", "description": "Brief description", "cookTime": "30 minutes", "servings": 4, "difficulty": "Easy/Medium/Hard", "ingredients": ["ingredient 1", "ingredient 2"], "instructions": ["step 1", "step 2"], "tips": ["tip 1", "tip 2"] }'
            },
            {
              role: 'user',
              content: `Create a recipe using these ingredients: ${ingredients}`
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate recipe')
      }

      const reader = response.body?.getReader()
      let result = ''
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          result += new TextDecoder().decode(value)
        }
      }

      // Parse the streaming response to extract JSON
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const recipeData = JSON.parse(jsonMatch[0])
        setRecipe(recipeData)
        toast({
          title: "Recipe Generated!",
          description: "Your delicious recipe is ready.",
        })
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error generating recipe:', error)
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-yellow-500 mb-4">AI Recipe Generator</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Transform your ingredients into delicious recipes with the power of AI.
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-600/50 border-yellow-500/50 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <ChefHat className="h-6 w-6 mr-2" />
              What ingredients do you have?
            </CardTitle>
            <CardDescription className="text-white/80">
              Enter your available ingredients and let AI create a perfect recipe for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., chicken breast, pasta, tomatoes, garlic, onions, cheese..."
              className="min-h-24 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              rows={4}
            />
            <Button 
              onClick={generateRecipe}
              disabled={isLoading}
              className="bg-white text-yellow-900 hover:bg-white/90 w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ChefHat className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Generating Recipe..." : "Generate Recipe"}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Recipe */}
        {recipe && (
          <div className="space-y-8">
            {/* Recipe Header */}
            <Card className="bg-[#1a1025] border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-500 mb-2">{recipe.title}</CardTitle>
                <CardDescription className="text-white/80 text-base">
                  {recipe.description}
                </CardDescription>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    <span className="text-white">{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-yellow-400" />
                    <span className="text-white">{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Utensils className="h-5 w-5 text-yellow-400" />
                    <Badge className={`
                      ${recipe.difficulty === 'Easy' ? 'bg-green-600' : 
                        recipe.difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'}
                      text-white
                    `}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Recipe Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ingredients */}
              <Card className="bg-[#1a1025] border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-white/80 flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="bg-[#1a1025] border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="text-white/80 flex items-start">
                        <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Tips */}
            {recipe.tips && recipe.tips.length > 0 && (
              <Card className="bg-[#1a1025] border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Chef's Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recipe.tips.map((tip, index) => (
                      <li key={index} className="text-white/80 flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
