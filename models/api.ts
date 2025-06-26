// General API types and common interfaces

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface SearchParams {
  query?: string
  category?: string
  tags?: string[]
  difficulty?: "easy" | "medium" | "hard"
  maxCookingTime?: number
  minRating?: number
}

// Error types
export interface ApiError {
  code: string
  message: string
  details?: string
  field?: string // For validation errors
}

export interface ValidationError extends ApiError {
  field: string
  value?: any
}

// HTTP Methods for type safety
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

// Common status codes
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

// Request headers interface
export interface RequestHeaders {
  "Content-Type"?: string
  Authorization?: string
  "X-User-ID"?: string
  [key: string]: string | undefined
}

// Generic request interface for typed API handlers
export interface TypedRequest<TBody = any, TQuery = any> {
  body: TBody
  query: TQuery
  headers: RequestHeaders
  method: HttpMethod
}

// Form data validation result
export interface ValidationResult<T = any> {
  isValid: boolean
  data?: T
  errors: ValidationError[]
}

// Request validation utilities
export interface RequestValidator<T> {
  validate(data: unknown): ValidationResult<T>
  validateField(field: keyof T, value: unknown): ValidationError | null
}

// Profile picture upload types
export interface UploadProfilePictureRequest {
  userId: string
  profilePicture: File
}

export interface UploadProfilePictureResponse extends ApiResponse {
  photoURL?: string
  photoPath?: string
}

// Complete recipe upload types (updated for local storage)
export interface UploadRecipeCompleteRequest {
  name: string
  description: string
  image: File
  userId?: string
}

export interface UploadRecipeCompleteResponse extends ApiResponse {
  data?: {
    documentId: string
    imageURL: string
    imageKey: string // The local file path/key
    name: string
    description: string
    localFilePath?: string // Full local file path
  }
  details?: string
}

// Local JSON record structure (updated from Firestore)
export interface FirestoreRecord {
  id: string // Unique identifier
  name: string
  imageURL: string
  imageKey: string // Relative path for reference
  description: string
  createdAt: string // ISO string instead of Firestore timestamp
  userId?: string
  metadata?: {
    originalFileName: string
    fileSize: number
    contentType: string
    uploadTimestamp: number
    localFilePath?: string // Full local file system path
  }
}

// Get recipes response
export interface GetRecipesResponse extends ApiResponse {
  data?: FirestoreRecord[]
  pagination?: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

// Get single recipe response
export interface GetRecipeResponse extends ApiResponse {
  data?: FirestoreRecord
}
