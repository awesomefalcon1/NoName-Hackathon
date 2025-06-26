import { type NextRequest, NextResponse } from "next/server"
import { db, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid" // For generating unique filenames

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const userId = formData.get("userId") as string
    const userName = formData.get("userName") as string
    const recipeName = formData.get("recipeName") as string
    const briefIngredients = formData.get("briefIngredients") as string
    const fullRecipe = formData.get("fullRecipe") as string
    const ingredientsString = formData.get("ingredients") as string // JSON string
    const recipeImageFile = formData.get("recipeImage") as File | null

    // Basic validation
    if (!userId || !userName || !recipeName || !fullRecipe || !ingredientsString || !recipeImageFile) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    // 1. Upload image to Firebase Storage
    const imageFileName = `${uuidv4()}-${recipeImageFile.name}`
    // It's good practice to store images in a path related to the user or recipe type
    const imageRef = ref(storage, `recipeImages/${userId}/${imageFileName}`)

    await uploadBytes(imageRef, recipeImageFile)
    const imageUrl = await getDownloadURL(imageRef)

    // 2. Parse ingredients string
    let ingredients
    try {
      ingredients = JSON.parse(ingredientsString)
      if (!Array.isArray(ingredients)) throw new Error("Ingredients must be an array.")
    } catch (e) {
      return NextResponse.json({ error: "Invalid ingredients format. Expected a JSON array." }, { status: 400 })
    }

    // 3. Prepare recipe data for Firestore
    const recipeData = {
      userId,
      userName,
      recipeName,
      briefIngredients,
      fullRecipe,
      ingredients, // Parsed array
      imageUrl,
      createdAt: serverTimestamp(),
      likes: 0, // Initial likes
      // Add any other relevant fields
    }

    // 4. Save recipe data to Firestore
    const recipesCollectionRef = collection(db, "recipes")
    const docRef = await addDoc(recipesCollectionRef, recipeData)

    return NextResponse.json(
      {
        message: "Recipe uploaded successfully!",
        recipeId: docRef.id,
        imageUrl: imageUrl,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error uploading recipe:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json({ error: "Failed to upload recipe.", details: errorMessage }, { status: 500 })
  }
}
