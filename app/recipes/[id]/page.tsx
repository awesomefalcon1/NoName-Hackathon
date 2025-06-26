"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, Clock, Users, Camera, Send, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface Recipe {
  id: string
  name: string
  userName: string
  userId: string
  imageUrl: string
  fullRecipe: string
  briefIngredients: string
  ingredients: Array<{
    name: string
    quantity: string
  }>
  likes: number
  createdAt: any
}

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  imageUrl?: string
  createdAt: any
  likes: number
}

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [commentImage, setCommentImage] = useState<File | null>(null)
  const [commentImageUrl, setCommentImageUrl] = useState<string | null>(null)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    // Mock data - replace with actual Firebase call
    const mockRecipe: Recipe = {
      id: params.id as string,
      name: "Spicy Chicken Pasta",
      userName: "ChefAnna",
      userId: "user123",
      imageUrl: "/placeholder.svg?height=400&width=600&text=Spicy+Chicken+Pasta",
      fullRecipe: `1. Heat olive oil in a large skillet over medium-high heat.
2. Season chicken breast with salt, pepper, and paprika, then cook until golden brown and cooked through (about 6-7 minutes per side).
3. Remove chicken and let rest, then slice into strips.
4. In the same skillet, add garlic and red pepper flakes, cook for 30 seconds.
5. Add diced tomatoes, chicken broth, and heavy cream. Bring to a simmer.
6. Add cooked pasta and sliced chicken back to the skillet.
7. Toss everything together and cook for 2-3 minutes until sauce thickens.
8. Garnish with fresh basil and parmesan cheese.
9. Serve immediately while hot.`,
      briefIngredients: "Chicken breast, pasta, tomatoes, cream, garlic, spices",
      ingredients: [
        { name: "Chicken Breast", quantity: "2 lbs" },
        { name: "Penne Pasta", quantity: "1 lb" },
        { name: "Diced Tomatoes", quantity: "1 can" },
        { name: "Heavy Cream", quantity: "1 cup" },
        { name: "Garlic", quantity: "4 cloves" },
        { name: "Red Pepper Flakes", quantity: "1 tsp" },
        { name: "Olive Oil", quantity: "2 tbsp" },
        { name: "Parmesan Cheese", quantity: "1/2 cup" },
        { name: "Fresh Basil", quantity: "1/4 cup" },
      ],
      likes: 156,
      createdAt: new Date(),
    }

    const mockComments: Comment[] = [
      {
        id: "1",
        userId: "user456",
        userName: "FoodLover23",
        userAvatar: "/placeholder.svg?height=40&width=40&text=FL",
        text: "This recipe is amazing! I made it last night and my family loved it. The spice level was perfect!",
        imageUrl: "/placeholder.svg?height=200&width=300&text=My+Version",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likes: 12,
      },
      {
        id: "2",
        userId: "user789",
        userName: "HomeCook",
        userAvatar: "/placeholder.svg?height=40&width=40&text=HC",
        text: "I substituted the heavy cream with coconut milk for a dairy-free version and it turned out great!",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        likes: 8,
      },
      {
        id: "3",
        userId: "user101",
        userName: "PastaQueen",
        userAvatar: "/placeholder.svg?height=40&width=40&text=PQ",
        text: "Here's my take on this recipe! Added some mushrooms and bell peppers for extra veggies.",
        imageUrl: "/placeholder.svg?height=200&width=300&text=With+Veggies",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        likes: 15,
      },
    ]

    setRecipe(mockRecipe)
    setComments(mockComments)
    setIsLoading(false)
  }, [params.id])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setCommentImage(file)
      setCommentImageUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post a comment.",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment before posting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingComment(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || user.email || "Anonymous",
      userAvatar: user.photoURL || undefined,
      text: newComment,
      imageUrl: commentImageUrl || undefined,
      createdAt: new Date(),
      likes: 0,
    }

    setComments((prev) => [comment, ...prev])
    setNewComment("")
    setCommentImage(null)
    setCommentImageUrl(null)
    setIsSubmittingComment(false)

    toast({
      title: "Comment posted!",
      description: "Your comment has been shared with the community.",
    })
  }

  const handleLikeRecipe = () => {
    setIsLiked(!isLiked)
    if (recipe) {
      setRecipe({
        ...recipe,
        likes: isLiked ? recipe.likes - 1 : recipe.likes + 1,
      })
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "1 day ago"
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
        <Button asChild>
          <Link href="/recipes">Back to Recipes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/recipes">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Link>
      </Button>

      {/* Recipe Header */}
      <div className="mb-8">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
          <Image src={recipe.imageUrl || "/placeholder.svg"} alt={recipe.name} fill className="object-cover" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>By {recipe.userName}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>30 mins</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>4 servings</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isLiked ? "default" : "outline"}
              onClick={handleLikeRecipe}
              className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
              {recipe.likes}
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span>{ingredient.name}</span>
                    <Badge variant="secondary">{ingredient.quantity}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-sm leading-relaxed">{recipe.fullRecipe}</div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nutrition Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Calories</span>
                <span className="font-medium">520</span>
              </div>
              <div className="flex justify-between">
                <span>Protein</span>
                <span className="font-medium">35g</span>
              </div>
              <div className="flex justify-between">
                <span>Carbs</span>
                <span className="font-medium">45g</span>
              </div>
              <div className="flex justify-between">
                <span>Fat</span>
                <span className="font-medium">18g</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add to Cart</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">Add All Ingredients</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Comments Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Community Posts</h2>
          <Badge variant="secondary">{comments.length}</Badge>
        </div>

        {/* Add Comment */}
        {user ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Textarea
                    placeholder="Share your experience making this recipe..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="comment-image"
                      />
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="comment-image" className="cursor-pointer">
                          <Camera className="h-4 w-4 mr-2" />
                          Add Photo
                        </label>
                      </Button>
                    </div>

                    <Button
                      onClick={handleSubmitComment}
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      {isSubmittingComment ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Post
                    </Button>
                  </div>

                  {commentImageUrl && (
                    <div className="relative w-32 h-32">
                      <Image
                        src={commentImageUrl || "/placeholder.svg"}
                        alt="Comment attachment"
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => {
                          setCommentImage(null)
                          setCommentImageUrl(null)
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Sign in to share your cooking experience!</p>
              <Button asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={comment.userAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{comment.userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm mb-3">{comment.text}</p>

                    {comment.imageUrl && (
                      <div className="relative w-48 h-32 mb-3">
                        <Image
                          src={comment.imageUrl || "/placeholder.svg"}
                          alt="User's cooking result"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
