import { toast as primitiveToast } from "@/hooks/use-toast"

/**
 * Standardized Toast Manager for NoName Recipes
 * Ensures consistent toast messaging and styling across the application
 */
export class ToastManager {
  // Standard durations (in milliseconds)
  private static readonly DURATION_SHORT = 3000
  private static readonly DURATION_MEDIUM = 5000
  private static readonly DURATION_LONG = 7000

  // Standard toast variants
  private static readonly VARIANTS = {
    SUCCESS: "default",
    ERROR: "destructive",
    WARNING: "destructive",
    INFO: "default",
  } as const

  /**
   * Show a success toast
   */
  static success(title: string, description?: string, duration?: number) {
    return primitiveToast({
      title,
      description,
      variant: this.VARIANTS.SUCCESS,
      duration: duration || this.DURATION_MEDIUM,
    })
  }

  /**
   * Show an error toast
   */
  static error(title: string, description?: string, duration?: number) {
    return primitiveToast({
      title,
      description,
      variant: this.VARIANTS.ERROR,
      duration: duration || this.DURATION_LONG,
    })
  }

  /**
   * Show a warning toast
   */
  static warning(title: string, description?: string, duration?: number) {
    return primitiveToast({
      title,
      description,
      variant: this.VARIANTS.WARNING,
      duration: duration || this.DURATION_MEDIUM,
    })
  }

  /**
   * Show an info toast
   */
  static info(title: string, description?: string, duration?: number) {
    return primitiveToast({
      title,
      description,
      variant: this.VARIANTS.INFO,
      duration: duration || this.DURATION_SHORT,
    })
  }

  // ===== RECIPE-SPECIFIC TOASTS =====

  /**
   * Recipe upload success
   */
  static recipeUploadSuccess(recipeName: string) {
    return this.success(
      "Recipe Uploaded Successfully!",
      `Your recipe "${recipeName}" has been saved and is now live.`
    )
  }

  /**
   * Recipe upload error
   */
  static recipeUploadError(error?: string) {
    return this.error(
      "Upload Failed",
      error || "Could not upload recipe. Please try again."
    )
  }

  /**
   * Recipe generation success
   */
  static recipeGenerationSuccess() {
    return this.success(
      "Recipe Generated!",
      "Your delicious recipe is ready."
    )
  }

  /**
   * Recipe generation error
   */
  static recipeGenerationError() {
    return this.error(
      "Generation Failed",
      "Failed to generate recipe. Please try again."
    )
  }

  /**
   * Missing ingredients warning
   */
  static missingIngredients() {
    return this.warning(
      "Missing Ingredients",
      "Please enter some ingredients to generate a recipe."
    )
  }

  // ===== AUTH-SPECIFIC TOASTS =====

  /**
   * Sign in success
   */
  static signInSuccess() {
    return this.success(
      "Signed In!",
      "Welcome back to NoName Recipes!"
    )
  }

  /**
   * Sign in error
   */
  static signInError(error?: string) {
    return this.error(
      "Sign In Failed",
      error || "Invalid email or password. Please try again."
    )
  }

  /**
   * Sign up success
   */
  static signUpSuccess() {
    return this.success(
      "Account Created!",
      "Welcome to NoName Recipes! You're now signed in."
    )
  }

  /**
   * Sign up error
   */
  static signUpError(error?: string) {
    return this.error(
      "Sign Up Failed",
      error || "Failed to create account. Please try again."
    )
  }

  /**
   * Sign out success
   */
  static signOutSuccess() {
    return this.info(
      "Signed Out",
      "You have been successfully signed out."
    )
  }

  /**
   * Sign out error
   */
  static signOutError() {
    return this.error(
      "Sign Out Failed",
      "Could not sign out. Please try again."
    )
  }

  /**
   * Authentication required
   */
  static authRequired(message?: string) {
    return this.warning(
      "Authentication Required",
      message || "Please sign in to access this page."
    )
  }

  /**
   * Terms agreement required
   */
  static termsRequired() {
    return this.warning(
      "Terms and Conditions",
      "You must agree to the terms and conditions to sign up."
    )
  }

  // ===== PROFILE-SPECIFIC TOASTS =====

  /**
   * Profile update success
   */
  static profileUpdateSuccess() {
    return this.success(
      "Profile Updated",
      "Your profile has been updated successfully."
    )
  }

  /**
   * Profile update error
   */
  static profileUpdateError() {
    return this.error(
      "Update Failed",
      "Could not update profile. Please try again."
    )
  }

  /**
   * Profile picture upload success
   */
  static profilePictureSuccess() {
    return this.success(
      "Profile Picture Updated",
      "Your profile picture has been updated successfully."
    )
  }

  /**
   * Profile picture upload error
   */
  static profilePictureError() {
    return this.error(
      "Upload Failed",
      "Could not update profile picture. Please try again."
    )
  }

  // ===== VALIDATION TOASTS =====

  /**
   * Missing required information
   */
  static missingInfo(fields: string) {
    return this.warning(
      "Missing Information",
      `Please provide ${fields}.`
    )
  }

  /**
   * Invalid file type
   */
  static invalidFileType(expectedType: string = "image") {
    return this.warning(
      "Invalid File Type",
      `Please select a valid ${expectedType} file.`
    )
  }

  /**
   * File too large
   */
  static fileTooLarge(maxSize: string = "10MB") {
    return this.warning(
      "File Too Large",
      `File must be smaller than ${maxSize}.`
    )
  }

  // ===== NETWORK TOASTS =====

  /**
   * Network error
   */
  static networkError() {
    return this.error(
      "Network Error",
      "Please check your internet connection and try again."
    )
  }

  /**
   * Server error
   */
  static serverError() {
    return this.error(
      "Server Error",
      "Something went wrong on our end. Please try again later."
    )
  }

  // ===== GENERIC ACTIONS =====

  /**
   * Generic success action
   */
  static actionSuccess(action: string) {
    return this.success(
      `${action} Successful!`,
      `Your ${action.toLowerCase()} has been completed.`
    )
  }

  /**
   * Generic error action
   */
  static actionError(action: string) {
    return this.error(
      `${action} Failed`,
      `Could not complete ${action.toLowerCase()}. Please try again.`
    )
  }

  /**
   * Coming soon feature
   */
  static comingSoon(feature: string) {
    return this.info(
      "Coming Soon",
      `${feature} will be available in a future update.`
    )
  }

  /**
   * Feature unavailable
   */
  static featureUnavailable(feature: string, reason?: string) {
    return this.warning(
      "Feature Unavailable",
      reason || `${feature} is currently unavailable.`
    )
  }
}

// Export individual methods for convenience
export const {
  success,
  error,
  warning,
  info,
  recipeUploadSuccess,
  recipeUploadError,
  recipeGenerationSuccess,
  recipeGenerationError,
  missingIngredients,
  signInSuccess,
  signInError,
  signUpSuccess,
  signUpError,
  signOutSuccess,
  signOutError,
  authRequired,
  termsRequired,
  profileUpdateSuccess,
  profileUpdateError,
  profilePictureSuccess,
  profilePictureError,
  missingInfo,
  invalidFileType,
  fileTooLarge,
  networkError,
  serverError,
  actionSuccess,
  actionError,
  comingSoon,
  featureUnavailable,
} = ToastManager
