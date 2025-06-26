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
