"use client"

import type React from "react"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Trophy,
  Heart,
  ChefHat,
  Settings,
  Bell,
  Shield,
  Loader2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { doc, updateDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Recipe } from "@/models"

interface UploadProfilePictureResponse {
  success: boolean
  message?: string
  photoURL?: string
}

interface UserStats {
  recipesUploaded: number
  totalLikes: number
  joinedDate: string
  favoriteRecipes: number
}

function ProfilePageContent() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    email: userProfile?.email || "",
  })

  // Profile picture state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [currentPhotoURL, setCurrentPhotoURL] = useState<string | null>(null)

  // User stats and recipes
  const [userStats, setUserStats] = useState<UserStats>({
    recipesUploaded: 0,
    totalLikes: 0,
    joinedDate: "",
    favoriteRecipes: 0,
  })
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    recipeUpdates: true,
    communityActivity: false,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public" as "public" | "private" | "friends",
    showEmail: false,
    showRecipeStats: true,
  })

  useEffect(() => {
    if (userProfile) {
      setEditedProfile({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
      })

      // Set current photo URL
      setCurrentPhotoURL(user?.photoURL || null)

      // Set join date from user creation
      if (user?.metadata?.creationTime) {
        setUserStats((prev) => ({
          ...prev,
          joinedDate: new Date(user.metadata.creationTime!).toLocaleDateString(),
        }))
      }
    }
  }, [userProfile, user])

  useEffect(() => {
    if (user) {
      fetchUserStats()
      fetchUserRecipes()
    }
  }, [user])

  const fetchUserStats = async () => {
    if (!user) return

    setIsLoadingStats(true)
    try {
      // Fetch user's recipes to calculate stats
      const recipesQuery = query(
        collection(db, "recipes"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      )

      const recipesSnapshot = await getDocs(recipesQuery)
      const recipes = recipesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Recipe[]

      const totalLikes = recipes.reduce((sum, recipe) => sum + (recipe.likes || 0), 0)

      setUserStats((prev) => ({
        ...prev,
        recipesUploaded: recipes.length,
        totalLikes,
        favoriteRecipes: 0, // This would need to be implemented separately
      }))
    } catch (error) {
      console.error("Error fetching user stats:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchUserRecipes = async () => {
    if (!user) return

    setIsLoadingRecipes(true)
    try {
      const recipesQuery = query(
        collection(db, "recipes"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      )

      const recipesSnapshot = await getDocs(recipesQuery)
      const recipes = recipesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Recipe[]

      setUserRecipes(recipes)
    } catch (error) {
      console.error("Error fetching user recipes:", error)
    } finally {
      setIsLoadingRecipes(false)
    }
  }

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        updatedAt: new Date(),
      })

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
        variant: "default",
      })

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedProfile({
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      email: userProfile?.email || "",
    })
    setIsEditing(false)
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !user) return

    const file = event.target.files[0]

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPG, PNG, GIF, WebP).",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB limit)
    const maxFileSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: "Profile picture must be smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploadingPhoto(true)

    try {
      // Get user's ID token for authentication
      const idToken = await user.getIdToken()

      // Create form data
      const formData = new FormData()
      formData.append("profilePicture", file)
      formData.append("userId", user.uid)

      // Upload to our API
      const response = await fetch("/api/upload-profile-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      })

      const result: UploadProfilePictureResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to upload profile picture")
      }

      // Update local state with new photo URL
      setCurrentPhotoURL(result.photoURL || null)

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully!",
        variant: "default",
      })

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="bg-white dark:bg-neutral-800">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={currentPhotoURL || ""} alt="Profile picture" />
                  <AvatarFallback className="text-2xl bg-yellow-500 text-black">
                    {getInitials(userProfile?.firstName, userProfile?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700"
                  onClick={handleCameraClick}
                  disabled={isUploadingPhoto}
                >
                  {isUploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">
                      {userProfile?.firstName} {userProfile?.lastName}
                    </h1>
                    <p className="text-muted-foreground flex items-center justify-center md:justify-start mt-1">
                      <Mail className="w-4 h-4 mr-2" />
                      {userProfile?.email}
                    </p>
                    <p className="text-muted-foreground flex items-center justify-center md:justify-start mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Joined {userStats.joinedDate}
                    </p>
                  </div>
                  <Badge variant="outline" className="mt-2 md:mt-0 border-yellow-500 text-yellow-600">
                    Recipe Creator
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-neutral-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <ChefHat className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {isLoadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : userStats.recipesUploaded}
                  </p>
                  <p className="text-sm text-muted-foreground">Recipes Shared</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {isLoadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : userStats.totalLikes}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Trophy className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{userStats.favoriteRecipes}</p>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center">
              <ChefHat className="w-4 h-4 mr-2" />
              My Recipes
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your account details and personal information.</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50 dark:bg-neutral-700" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50 dark:bg-neutral-700" : ""}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      disabled={true}
                      className="bg-gray-50 dark:bg-neutral-700"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Recipes Tab */}
          <TabsContent value="recipes" className="space-y-6">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle>My Recipes</CardTitle>
                <CardDescription>All the recipes you've shared with the community.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecipes ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : userRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userRecipes.map((recipe) => (
                      <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-32">
                          <Image
                            src={recipe.imageUrl || "/placeholder.svg"}
                            alt={recipe.recipeName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold truncate">{recipe.recipeName}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{recipe.briefIngredients}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span className="text-sm">{recipe.likes || 0}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => router.push(`/recipes/${recipe.id}`)}>
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't shared any recipes yet.</p>
                    <Button
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
                      onClick={() => router.push("/upload")}
                    >
                      Share Your First Recipe
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Notification Settings */}
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about activity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="recipe-updates">Recipe Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about likes and comments</p>
                  </div>
                  <Switch
                    id="recipe-updates"
                    checked={notifications.recipeUpdates}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, recipeUpdates: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="community-activity">Community Activity</Label>
                    <p className="text-sm text-muted-foreground">Updates about new recipes and trends</p>
                  </div>
                  <Switch
                    id="community-activity"
                    checked={notifications.communityActivity}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, communityActivity: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control who can see your information and activity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email">Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">Make your email visible to other users</p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showEmail: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-stats">Show Recipe Statistics</Label>
                    <p className="text-sm text-muted-foreground">Display your recipe count and likes publicly</p>
                  </div>
                  <Switch
                    id="show-stats"
                    checked={privacy.showRecipeStats}
                    onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showRecipeStats: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute message="Please sign in to view your profile.">
      <ProfilePageContent />
    </ProtectedRoute>
  )
}
