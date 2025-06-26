// Recipe-related types and interfaces

export interface Recipe {
  id: string
  userId: string
  userName: string
  recipeName: string
  briefIngredients: string
  fullRecipe: string
  ingredients: RecipeIngredient[]
  imageUrl: string
  createdAt: Date | FirebaseTimestamp
  likes: number
  shortSupply?: boolean
  tags?: string[]
  difficulty?: "easy" | "medium" | "hard"
  cookingTime?: number // in minutes
  servings?: number
}

export interface RecipeIngredient {
  name: string
  quantity: string
  storeProductId?: string | null
  storeProductName?: string | null
  storeProductPrice?: string | null
  storeProductImageUrl?: string | null
}

export interface StoreProduct {
  id: string
  name: string
  price: string
  imageUrl: string
  category?: string
  inStock?: boolean
}

// For Firebase Timestamp compatibility
export interface FirebaseTimestamp {
  seconds: number
  nanoseconds: number
}

// Request/Response types for API endpoints
export interface UploadRecipeRequest {
  userId: string
  userName: string
  recipeName: string
  briefIngredients: string
  fullRecipe: string
  ingredients: string // JSON string of RecipeIngredient[]
  recipeImage: File
}

// Form data structure for multipart/form-data requests
export interface UploadRecipeFormData {
  userId: string
  userName: string
  recipeName: string
  briefIngredients: string
  fullRecipe: string
  ingredients: string // JSON stringified RecipeIngredient[]
  recipeImage: File
}

export interface UploadRecipeResponse {
  success: boolean
  message: string
  recipeId?: string
  imageUrl?: string
  error?: string
  details?: string
}

export interface GetRecipesResponse {
  success: boolean
  recipes?: Recipe[]
  error?: string
  total?: number
  page?: number
  limit?: number
}

export interface GetRecipeByIdResponse {
  success: boolean
  recipe?: Recipe
  error?: string
}

export interface UpdateRecipeLikesRequest {
  recipeId: string
  userId: string
  action: "like" | "unlike"
}

export interface UpdateRecipeLikesResponse {
  success: boolean
  newLikesCount?: number
  error?: string
}

// Client-side ingredient interface (used in upload form)
export interface ClientIngredient {
  id: string
  name: string
  quantity: string
  storeProduct?: StoreProduct
}

// Validation schemas for request data
export interface RecipeValidationRules {
  recipeName: {
    minLength: number
    maxLength: number
    required: boolean
  }
  briefIngredients: {
    minLength: number
    maxLength: number
    required: boolean
  }
  fullRecipe: {
    minLength: number
    maxLength: number
    required: boolean
  }
  recipeImage: {
    maxSize: number // in bytes
    allowedTypes: string[]
    required: boolean
  }
  ingredients: {
    minCount: number
    maxCount: number
    required: boolean
  }
}

export const RECIPE_VALIDATION_RULES: RecipeValidationRules = {
  recipeName: {
    minLength: 3,
    maxLength: 100,
    required: true,
  },
  briefIngredients: {
    minLength: 10,
    maxLength: 500,
    required: true,
  },
  fullRecipe: {
    minLength: 20,
    maxLength: 5000,
    required: true,
  },
  recipeImage: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
    required: true,
  },
  ingredients: {
    minCount: 1,
    maxCount: 50,
    required: true,
  },
}
