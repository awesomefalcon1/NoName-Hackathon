# Toast Manager Usage Guide

The `ToastManager` class provides a standardized way to display toast notifications across the NoName Recipes application. It ensures consistent messaging, styling, and user experience.

## Import

```typescript
import { ToastManager } from "@/lib/toast-manager"
// Or import specific methods
import { success, error, recipeUploadSuccess } from "@/lib/toast-manager"
```

## Basic Usage

### Generic Toast Types

```typescript
// Success toast (green, 5 seconds)
ToastManager.success("Operation completed!", "Your action was successful.")

// Error toast (red, 7 seconds)
ToastManager.error("Something went wrong", "Please try again.")

// Warning toast (yellow/red, 5 seconds)
ToastManager.warning("Please check your input", "Some fields are missing.")

// Info toast (blue, 3 seconds)
ToastManager.info("New feature available", "Check out our latest update!")
```

### Custom Duration

```typescript
// Custom duration (in milliseconds)
ToastManager.success("Quick message", undefined, 2000) // 2 seconds
ToastManager.error("Important error", "This needs attention", 10000) // 10 seconds
```

## Recipe-Specific Toasts

```typescript
// Recipe upload
ToastManager.recipeUploadSuccess("Chocolate Cake")
ToastManager.recipeUploadError("Network connection failed")

// Recipe generation
ToastManager.recipeGenerationSuccess()
ToastManager.recipeGenerationError()

// Missing ingredients
ToastManager.missingIngredients()
```

## Authentication Toasts

```typescript
// Sign in/up
ToastManager.signInSuccess()
ToastManager.signInError("Invalid credentials")
ToastManager.signUpSuccess()
ToastManager.signUpError("Email already exists")

// Sign out
ToastManager.signOutSuccess()
ToastManager.signOutError()

// Authentication required
ToastManager.authRequired("Please sign in to upload recipes")
ToastManager.termsRequired()
```

## Profile Toasts

```typescript
// Profile updates
ToastManager.profileUpdateSuccess()
ToastManager.profileUpdateError()

// Profile picture
ToastManager.profilePictureSuccess()
ToastManager.profilePictureError()
```

## Validation Toasts

```typescript
// Missing information
ToastManager.missingInfo("recipe name, image, and ingredients")

// File validation
ToastManager.invalidFileType("image")
ToastManager.fileTooLarge("5MB")
```

## Network & Server Toasts

```typescript
// Network issues
ToastManager.networkError()
ToastManager.serverError()
```

## Generic Action Toasts

```typescript
// Generic success/error for any action
ToastManager.actionSuccess("Save")
ToastManager.actionError("Delete")

// Feature availability
ToastManager.comingSoon("Advanced recipe search")
ToastManager.featureUnavailable("Offline mode", "Requires internet connection")
```

## Migration from Old Toast Usage

### Before (Old Way)
```typescript
const { toast } = useToast()

toast({
  title: "Recipe Generated!",
  description: "Your delicious recipe is ready.",
  variant: "default",
})
```

### After (New Way)
```typescript
import { ToastManager } from "@/lib/toast-manager"

ToastManager.recipeGenerationSuccess()
```

## Benefits

1. **Consistency**: All toasts use standardized messaging and timing
2. **Maintainability**: Easy to update toast messages across the app
3. **Type Safety**: TypeScript ensures correct usage
4. **Categorization**: Domain-specific methods for different features
5. **Standardized Durations**: Consistent timing for different message types
6. **Reusability**: Common patterns encapsulated in methods

## Best Practices

1. **Use specific methods** when available (e.g., `recipeUploadSuccess` instead of generic `success`)
2. **Keep titles short** and descriptions informative
3. **Don't overuse toasts** - only for important feedback
4. **Use appropriate variants**:
   - Success: Completed actions
   - Error: Failed operations that need user attention
   - Warning: User input issues or cautionary messages
   - Info: Neutral information or tips

## Standard Durations

- **Info**: 3 seconds (quick, non-critical info)
- **Success/Warning**: 5 seconds (standard feedback)
- **Error**: 7 seconds (needs more time to read and act on)

## Adding New Toast Types

To add new standardized toasts, extend the `ToastManager` class:

```typescript
// Add to ToastManager class
static newFeatureSuccess(featureName: string) {
  return this.success(
    "New Feature Activated!",
    `${featureName} is now available in your account.`
  )
}
```

Then export it at the bottom of the file for convenience imports.
