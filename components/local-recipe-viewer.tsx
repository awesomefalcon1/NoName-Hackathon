"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, FileImage, Database } from "lucide-react"
import Image from "next/image"
import type { FirestoreRecord, GetRecipesResponse } from "@/models/api"

export default function LocalRecipeViewer() {
  const [recipes, setRecipes] = useState<FirestoreRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [totalRecipes, setTotalRecipes] = useState(0)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async (search?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: "20",
        offset: "0",
        ...(search && { search }),
      })

      const response = await fetch(`/api/get-recipes?${params}`)
      const result: GetRecipesResponse = await response.json()

      if (result.success && result.data) {
        setRecipes(result.data)
        setTotalRecipes(result.pagination?.total || 0)
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchRecipes(searchTerm)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-4">Local Recipe Database</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            View all recipes stored in the local JSON database with images saved to the file system.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{totalRecipes}</p>
                  <p className="text-sm text-muted-foreground">Total Recipes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileImage className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{recipes.length}</p>
                  <p className="text-sm text-muted-foreground">Loaded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <User className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{new Set(recipes.map((r) => r.userId).filter(Boolean)).size}</p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-2">
              <Input
                placeholder="Search recipes by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recipes Grid */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading recipes...</p>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={recipe.imageURL || "/placeholder.svg"}
                    alt={recipe.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = "/placeholder.svg?height=200&width=300&text=Image+Not+Found"
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      Local
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{recipe.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(recipe.createdAt)}
                  </div>

                  {recipe.userId && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      {recipe.userId}
                    </div>
                  )}

                  {recipe.metadata && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>
                        <strong>File:</strong> {recipe.metadata.originalFileName}
                      </p>
                      <p>
                        <strong>Size:</strong> {formatFileSize(recipe.metadata.fileSize)}
                      </p>
                      <p>
                        <strong>Type:</strong> {recipe.metadata.contentType}
                      </p>
                      <p>
                        <strong>Key:</strong> {recipe.imageKey}
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <Badge variant="outline" className="text-xs">
                      ID: {recipe.id}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recipes found.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Upload some recipes using the upload form to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
