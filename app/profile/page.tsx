"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, Award, Trophy, Star } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { useState } from "react"

function ProfilePageContent() {
  const { user, userProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(userProfile?.firstName || "")
  const [lastName, setLastName] = useState(userProfile?.lastName || "")

  const stats = {
    recipesShared: 12,
    totalLikes: 248,
    pcoPoints: 1250,
    rank: "Chef"
  }

  const handleSave = () => {
    // TODO: Implement profile update logic
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <User className="w-6 h-6 mr-2 text-yellow-500" />
              Profile
            </CardTitle>
            <CardDescription>
              Manage your profile and track your cooking achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.photoURL || ""} alt="Profile" />
                <AvatarFallback className="text-2xl">
                  {firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-grow space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold">
                      {firstName && lastName ? `${firstName} ${lastName}` : "Anonymous Chef"}
                    </h2>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Mail className="w-4 h-4 mr-2" />
                      {user?.email}
                    </div>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Member since {new Date(user?.metadata?.creationTime || "").toLocaleDateString()}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.recipesShared}</p>
                  <p className="text-sm text-gray-600">Recipes Shared</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalLikes}</p>
                  <p className="text-sm text-gray-600">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.pcoPoints.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">PCO Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.rank}</p>
                  <p className="text-sm text-gray-600">Current Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest cooking adventures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="font-semibold">Recipe "Pasta Carbonara" got 15 new likes!</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <Award className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold">Earned 50 PCO points for uploading a new recipe</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <Star className="w-8 h-8 text-red-500" />
                <div>
                  <p className="font-semibold">Reached 200 total likes milestone!</p>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
