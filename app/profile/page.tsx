"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  ChefHat,
  Edit3,
  Save,
  X,
  Calendar,
  Mail,
  Camera,
  Coins,
  Percent,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"

// Mock data - this would normally come from your backend/Firestore
const mockUserStats = {
  pcoPoints: 2450,
  recipesPosted: 12,
  recipesLiked: 34,
  totalLikes: 156,
  memberSince: "2023-06-15",
  discountsSaved: 89.5,
}

const mockCoupons = [
  {
    id: "1",
    title: "20% Off Fresh Produce",
    description: "Valid on all fresh fruits and vegetables",
    discount: "20%",
    expiryDate: "2024-02-15",
    code: "FRESH20",
    isUsed: false,
    category: "Produce",
  },
  {
    id: "2",
    title: "$5 Off $30 Purchase",
    description: "Minimum purchase of $30 required",
    discount: "$5",
    expiryDate: "2024-02-28",
    code: "SAVE5",
    isUsed: false,
    category: "General",
  },
  {
    id: "3",
    title: "Free Delivery",
    description: "Free delivery on your next order",
    discount: "Free",
    expiryDate: "2024-01-31",
    code: "FREEDEL",
    isUsed: true,
    category: "Delivery",
  },
]

const mockMyRecipes = [
  {
    id: "1",
    name: "Spicy Chicken Tacos",
    likes: 45,
    imageUrl: "/placeholder.svg?height=100&width=100",
    createdAt: "2024-01-15",
    status: "published",
  },
  {
    id: "2",
    name: "Vegetarian Pasta Salad",
    likes: 32,
    imageUrl: "/placeholder.svg?height=100&width=100",
    createdAt: "2024-01-10",
    status: "published",
  },
  {
    id: "3",
    name: "Chocolate Chip Cookies",
    likes: 78,
    imageUrl: "/placeholder.svg?height=100&width=100",
    createdAt: "2024-01-05",
    status: "draft",
  },
]

const mockLikedRecipes = [
  {
    id: "4",
    name: "Thai Green Curry",
    author: "ChefMaster",
    imageUrl: "/placeholder.svg?height=100&width=100",
    likedAt: "2024-01-20",
  },
  {
    id: "5",
    name: "Homemade Pizza",
    author: "PizzaLover",
    imageUrl: "/placeholder.svg?height=100&width=100",
    likedAt: "2024-01-18",
  },
  {
    id: "6",
    name: "Banana Bread",
    author: "BakeQueen",
    imageUrl: "/placeholder.svg?height=100&width=100",
    likedAt: "2024-01-16",
  },
]

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your profile.",
        variant: "destructive",
      })
      router.push("/signin")
      return
    }

    if (userProfile) {
      setEditedProfile({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phone: "",
        location: "",
      })
    }
  }, [user, loading, router, userProfile, toast])

  const handleSaveProfile = async () => {
    try {
      // Here you would save to your backend
      // For now, we'll just show a success message
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "success",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUseCoupon = (couponId: string) => {
    toast({
      title: "Coupon Applied",
      description: "Coupon has been applied to your cart.",
      variant: "success",
    })
  }

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please sign in to view your profile and manage your account.
            </p>
            <div className="space-y-2">
              <Link href="/signin" className="w-full">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">Sign In</Button>
              </Link>
              <Link href="/get-started" className="w-full">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    const firstName = userProfile?.firstName || user?.email?.charAt(0) || "U"
    const lastName = userProfile?.lastName || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  // Get display name
  const getDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`
    }
    if (userProfile?.firstName) {
      return userProfile.firstName
    }
    return user?.email?.split("@")[0] || "User"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                <AvatarFallback className="text-2xl bg-yellow-100 text-yellow-800">{getInitials()}</AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1">
              {!isEditing ? (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getDisplayName()}</h1>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {user?.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Member since {new Date(mockUserStats.memberSince).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full mx-auto mb-4">
              <Coins className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-600">{mockUserStats.pcoPoints.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">PC Optimum Points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4">
              <ChefHat className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">{mockUserStats.recipesPosted}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recipes Posted</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-4">
              <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-red-600">{mockUserStats.totalLikes}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes Received</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-green-600">${mockUserStats.discountsSaved}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="points" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="points">PC Points & Rewards</TabsTrigger>
          <TabsTrigger value="coupons">Discount Coupons</TabsTrigger>
          <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
          <TabsTrigger value="liked-recipes">Liked Recipes</TabsTrigger>
        </TabsList>

        {/* PC Points & Rewards Tab */}
        <TabsContent value="points" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="h-5 w-5 mr-2 text-yellow-600" />
                PC Optimum Points
              </CardTitle>
              <CardDescription>
                Earn points by sharing recipes and purchasing ingredients through our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Current Balance</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {mockUserStats.pcoPoints.toLocaleString()} points
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Equivalent to</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${(mockUserStats.pcoPoints / 1000).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">How to Earn Points</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Upload a recipe: 50 points</li>
                      <li>• Recipe gets liked: 10 points</li>
                      <li>• Purchase ingredients: 1 point per $1</li>
                      <li>• Complete weekly challenges: 100 points</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Recent Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Recipe liked</span>
                        <span className="text-green-600">+10 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ingredient purchase</span>
                        <span className="text-green-600">+25 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New recipe posted</span>
                        <span className="text-green-600">+50 pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discount Coupons Tab */}
        <TabsContent value="coupons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2 text-green-600" />
                Available Coupons
              </CardTitle>
              <CardDescription>Your discount coupons and promotional offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockCoupons.map((coupon) => (
                  <Card key={coupon.id} className={`${coupon.isUsed ? "opacity-50" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant={coupon.isUsed ? "secondary" : "default"} className="mb-2">
                          {coupon.category}
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{coupon.discount}</div>
                          <div className="text-xs text-gray-500">OFF</div>
                        </div>
                      </div>

                      <h3 className="font-semibold mb-2">{coupon.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{coupon.description}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>Code: {coupon.code}</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Expires {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                      </div>

                      <Button
                        className="w-full"
                        size="sm"
                        disabled={coupon.isUsed}
                        onClick={() => handleUseCoupon(coupon.id)}
                      >
                        {coupon.isUsed ? "Used" : "Apply Coupon"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Recipes Tab */}
        <TabsContent value="my-recipes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <ChefHat className="h-5 w-5 mr-2 text-orange-600" />
                    My Recipes
                  </CardTitle>
                  <CardDescription>Recipes you've shared with the community</CardDescription>
                </div>
                <Link href="/upload">
                  <Button className="bg-orange-600 hover:bg-orange-700">Upload New Recipe</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockMyRecipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden">
                    <div className="relative">
                      <Image
                        src={recipe.imageUrl || "/placeholder.svg"}
                        alt={recipe.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Badge
                        className={`absolute top-2 right-2 ${
                          recipe.status === "published" ? "bg-green-600" : "bg-yellow-600"
                        }`}
                      >
                        {recipe.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{recipe.name}</h3>
                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-red-500" />
                          {recipe.likes} likes
                        </span>
                        <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Link href={`/recipes/${recipe.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Liked Recipes Tab */}
        <TabsContent value="liked-recipes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-600" />
                Liked Recipes
              </CardTitle>
              <CardDescription>Recipes you've saved and loved from the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockLikedRecipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden">
                    <Image
                      src={recipe.imageUrl || "/placeholder.svg"}
                      alt={recipe.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{recipe.name}</h3>
                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span>By {recipe.author}</span>
                        <span>Liked {new Date(recipe.likedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/recipes/${recipe.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            View Recipe
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
