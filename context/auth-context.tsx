"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import type { FirebaseError } from "firebase/app"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<User | null>
  signIn: (email: string, password: string) => Promise<User | null>
  signOut: () => Promise<void>
  // Add a field for user profile data if needed
  userProfile: UserProfile | null
}

interface UserProfile {
  uid: string
  email: string | null
  firstName?: string
  lastName?: string
  // Add other profile fields as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch user profile from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile)
        } else {
          // Potentially create a basic profile if it doesn't exist
          setUserProfile({ uid: firebaseUser.uid, email: firebaseUser.email })
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<User | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      // Create user document in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid)
      const profileData: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firstName || "",
        lastName: lastName || "",
      }
      await setDoc(userDocRef, profileData)
      setUserProfile(profileData)
      return firebaseUser
    } catch (error) {
      const firebaseError = error as FirebaseError
      console.error("Error signing up:", firebaseError.message)
      // Handle specific errors (e.g., email-already-in-use)
      throw firebaseError // Re-throw to be caught by the calling component
    }
  }

  const signIn = async (email: string, password: string): Promise<User | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      const firebaseError = error as FirebaseError
      console.error("Error signing in:", firebaseError.message)
      // Handle specific errors (e.g., user-not-found, wrong-password)
      throw firebaseError
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, userProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
