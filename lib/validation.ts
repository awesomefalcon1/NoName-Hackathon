import type {
  UploadRecipeFormData,
  RecipeIngredient,
  ValidationResult,
  ValidationError,
  RequestValidator,
} from "@/models"
import { RECIPE_VALIDATION_RULES } from "@/models"

export class RecipeRequestValidator implements RequestValidator<UploadRecipeFormData> {
  validate(formData: FormData): ValidationResult<UploadRecipeFormData> {
    const errors: ValidationError[] = []

    // Extract and validate each field
    const userId = this.validateUserId(formData.get("userId"))
    const userName = this.validateUserName(formData.get("userName"))
    const recipeName = this.validateRecipeName(formData.get("recipeName"))
    const briefIngredients = this.validateBriefIngredients(formData.get("briefIngredients"))
    const fullRecipe = this.validateFullRecipe(formData.get("fullRecipe"))
    const ingredientsString = this.validateIngredientsString(formData.get("ingredients"))
    const recipeImage = this.validateRecipeImage(formData.get("recipeImage"))

    // Collect all validation errors
    if (userId.error) errors.push(userId.error)
    if (userName.error) errors.push(userName.error)
    if (recipeName.error) errors.push(recipeName.error)
    if (briefIngredients.error) errors.push(briefIngredients.error)
    if (fullRecipe.error) errors.push(fullRecipe.error)
    if (ingredientsString.error) errors.push(ingredientsString.error)
    if (recipeImage.error) errors.push(recipeImage.error)

    // If no errors, return validated data
    if (errors.length === 0) {
      return {
        isValid: true,
        data: {
          userId: userId.value!,
          userName: userName.value!,
          recipeName: recipeName.value!,
          briefIngredients: briefIngredients.value!,
          fullRecipe: fullRecipe.value!,
          ingredients: ingredientsString.value!,
          recipeImage: recipeImage.value!,
        },
        errors: [],
      }
    }

    return {
      isValid: false,
      errors,
    }
  }

  validateField(field: keyof UploadRecipeFormData, value: unknown): ValidationError | null {
    switch (field) {
      case "userId":
        return this.validateUserId(value).error || null
      case "userName":
        return this.validateUserName(value).error || null
      case "recipeName":
        return this.validateRecipeName(value).error || null
      case "briefIngredients":
        return this.validateBriefIngredients(value).error || null
      case "fullRecipe":
        return this.validateFullRecipe(value).error || null
      case "ingredients":
        return this.validateIngredientsString(value).error || null
      case "recipeImage":
        return this.validateRecipeImage(value).error || null
      default:
        return null
    }
  }

  private validateUserId(value: unknown): { value?: string; error?: ValidationError } {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      return {
        error: {
          code: "INVALID_USER_ID",
          message: "User ID is required",
          field: "userId",
          value,
        },
      }
    }
    return { value: value.trim() }
  }

  private validateUserName(value: unknown): { value?: string; error?: ValidationError } {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      return {
        error: {
          code: "INVALID_USER_NAME",
          message: "User name is required",
          field: "userName",
          value,
        },
      }
    }
    return { value: value.trim() }
  }

  private validateRecipeName(value: unknown): { value?: string; error?: ValidationError } {
    if (!value || typeof value !== "string") {
      return {
        error: {
          code: "INVALID_RECIPE_NAME",
          message: "Recipe name is required",
          field: "recipeName",
          value,
        },
      }
    }

    const trimmed = value.trim()
    const rules = RECIPE_VALIDATION_RULES.recipeName

    if (trimmed.length < rules.minLength) {
      return {
        error: {
          code: "RECIPE_NAME_TOO_SHORT",
          message: `Recipe name must be at least ${rules.minLength} characters`,
          field: "recipeName",
          value,
        },
      }
    }

    if (trimmed.length > rules.maxLength) {
      return {
        error: {
          code: "RECIPE_NAME_TOO_LONG",
          message: `Recipe name must be no more than ${rules.maxLength} characters`,
          field: "recipeName",
          value,
        },
      }
    }

    return { value: trimmed }
  }

  private validateBriefIngredients(value: unknown): { value?: string; error?: ValidationError } {
    if (!value || typeof value !== "string") {
      return {
        error: {
          code: "INVALID_BRIEF_INGREDIENTS",
          message: "Brief ingredients are required",
          field: "briefIngredients",
          value,
        },
      }
    }

    const trimmed = value.trim()
    const rules = RECIPE_VALIDATION_RULES.briefIngredients

    if (trimmed.length < rules.minLength) {
      return {
        error: {
          code: "BRIEF_INGREDIENTS_TOO_SHORT",
          message: `Brief ingredients must be at least ${rules.minLength} characters`,
          field: "briefIngredients",
          value,
        },
      }
    }

    if (trimmed.length > rules.maxLength) {
      return {
        error: {
          code: "BRIEF_INGREDIENTS_TOO_LONG",
          message: `Brief ingredients must be no more than ${rules.maxLength} characters`,
          field: "briefIngredients",
          value,
        },
      }
    }

    return { value: trimmed }
  }

  private validateFullRecipe(value: unknown): { value?: string; error?: ValidationError } {
    if (!value || typeof value !== "string") {
      return {
        error: {
          code: "INVALID_FULL_RECIPE",
          message: "Full recipe is required",
          field: "fullRecipe",
          value,
        },
      }
    }

    const trimmed = value.trim()
    const rules = RECIPE_VALIDATION_RULES.fullRecipe

    if (trimmed.length < rules.minLength) {
      return {
        error: {
          code: "FULL_RECIPE_TOO_SHORT",
          message: `Full recipe must be at least ${rules.minLength} characters`,
          field: "fullRecipe",
          value,
        },
      }
    }

    if (trimmed.length > rules.maxLength) {
      return {
        error: {
          code: "FULL_RECIPE_TOO_LONG",
          message: `Full recipe must be no more than ${rules.maxLength} characters`,
          field: "fullRecipe",
          value,
        },
      }
    }

    return { value: trimmed }
  }

  private validateIngredientsString(value: unknown): { value?: string; error?: ValidationError } {
    if (!value || typeof value !== "string") {
      return {
        error: {
          code: "INVALID_INGREDIENTS",
          message: "Ingredients are required",
          field: "ingredients",
          value,
        },
      }
    }

    // Try to parse the JSON
    let ingredients: RecipeIngredient[]
    try {
      ingredients = JSON.parse(value)
    } catch (e) {
      return {
        error: {
          code: "INVALID_INGREDIENTS_FORMAT",
          message: "Ingredients must be valid JSON",
          field: "ingredients",
          value,
          details: e instanceof Error ? e.message : "JSON parsing failed",
        },
      }
    }

    // Validate it's an array
    if (!Array.isArray(ingredients)) {
      return {
        error: {
          code: "INGREDIENTS_NOT_ARRAY",
          message: "Ingredients must be an array",
          field: "ingredients",
          value,
        },
      }
    }

    const rules = RECIPE_VALIDATION_RULES.ingredients

    // Validate array length
    if (ingredients.length < rules.minCount) {
      return {
        error: {
          code: "TOO_FEW_INGREDIENTS",
          message: `At least ${rules.minCount} ingredient is required`,
          field: "ingredients",
          value,
        },
      }
    }

    if (ingredients.length > rules.maxCount) {
      return {
        error: {
          code: "TOO_MANY_INGREDIENTS",
          message: `No more than ${rules.maxCount} ingredients allowed`,
          field: "ingredients",
          value,
        },
      }
    }

    // Validate each ingredient
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i]
      if (!ingredient.name || !ingredient.quantity) {
        return {
          error: {
            code: "INVALID_INGREDIENT",
            message: `Ingredient ${i + 1} must have both name and quantity`,
            field: "ingredients",
            value,
          },
        }
      }
    }

    return { value }
  }

  private validateRecipeImage(value: unknown): { value?: File; error?: ValidationError } {
    if (!value || !(value instanceof File)) {
      return {
        error: {
          code: "INVALID_RECIPE_IMAGE",
          message: "Recipe image is required",
          field: "recipeImage",
          value,
        },
      }
    }

    const rules = RECIPE_VALIDATION_RULES.recipeImage

    // Validate file size
    if (value.size > rules.maxSize) {
      return {
        error: {
          code: "FILE_TOO_LARGE",
          message: `Image file must be smaller than ${rules.maxSize / (1024 * 1024)}MB`,
          field: "recipeImage",
          value,
        },
      }
    }

    // Validate file type
    if (!rules.allowedTypes.includes(value.type)) {
      return {
        error: {
          code: "INVALID_FILE_TYPE",
          message: `Image must be one of: ${rules.allowedTypes.join(", ")}`,
          field: "recipeImage",
          value,
        },
      }
    }

    return { value }
  }
}
