"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import type { FirebaseError } from "firebase/app"

export default function SignInPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log("Attempting sign in with:", email)
      await signIn(email, password)
      console.log("Sign in successful")
      toast({
        title: "Signed In!",
        description: "Welcome back to NoName Recipes!",
        variant: "default",
      })
      router.push("/") // Redirect to home page
    } catch (error) {
      const firebaseError = error as FirebaseError
      let errorMessage = "Failed to sign in. Please check your credentials."
      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password" ||
        firebaseError.code === "auth/invalid-credential"
      ) {
        errorMessage = "Invalid email or password. Please try again."
      }
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      })
      console.error("Sign in error:", firebaseError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-neutral-900">
      <Card className="w-full max-w-md bg-white dark:bg-neutral-800 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your recipes and rewards
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 dark:bg-neutral-700"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <Link href="/forgot-password" className="text-sm text-yellow-600 dark:text-yellow-500 hover:underline">
                  Forgot password?
                </Link> */}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 dark:bg-neutral-700"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/get-started" className="text-yellow-600 dark:text-yellow-500 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
