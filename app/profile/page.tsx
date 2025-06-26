"use client"

import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, userProfile, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <User className="w-6 h-6 mr-2 text-yellow-500" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            
            {userProfile?.firstName && (
              <div>
                <label className="text-sm font-medium">First Name</label>
                <p className="text-muted-foreground">{userProfile.firstName}</p>
              </div>
            )}
            
            {userProfile?.lastName && (
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <p className="text-muted-foreground">{userProfile.lastName}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">User ID</label>
              <p className="text-muted-foreground text-xs">{user.uid}</p>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={signOut} 
                variant="outline" 
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
