"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "./ui/use-toast"

interface ProtectedRouteProps {
  children: ReactNode
  message?: string // Optional message for the toast
}

export default function ProtectedRoute({ children, message }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: message || "Please sign in to access this page.",
        variant: "destructive",
      })
      router.push("/signin")
    }
  }, [user, authLoading, router, toast, message])

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] w-full">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
      </div>
    )
  }

  if (!user) {
    // User is not authenticated, and redirection should be in progress.
    // Returning null prevents rendering children while redirecting.
    return null
  }

  return <>{children}</>
}
