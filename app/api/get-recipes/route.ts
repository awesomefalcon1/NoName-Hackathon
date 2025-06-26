import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { FirestoreRecord } from "@/models/api"

const DATABASE_FILE = path.join(process.cwd(), "data/recipes.json")

// Read records from JSON file
async function readRecords(): Promise<FirestoreRecord[]> {
  try {
    const data = await fs.readFile(DATABASE_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const userId = searchParams.get("userId")
    const search = searchParams.get("search")

    // Read all records
    let records = await readRecords()

    // Filter by userId if provided
    if (userId) {
      records = records.filter((record) => record.userId === userId)
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase()
      records = records.filter(
        (record) =>
          record.name.toLowerCase().includes(searchLower) || record.description.toLowerCase().includes(searchLower),
      )
    }

    // Sort by creation date (newest first)
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Apply pagination
    const total = records.length
    const paginatedRecords = records.slice(offset, offset + limit)

    return NextResponse.json(
      {
        success: true,
        data: paginatedRecords,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error reading recipes:", error)
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to read recipes from local database",
      },
      { status: 500 },
    )
  }
}
