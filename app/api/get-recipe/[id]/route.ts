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
    return []
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_ID",
          message: "Recipe ID is required",
        },
        { status: 400 },
      )
    }

    // Read all records
    const records = await readRecords()

    // Find the specific record
    const record = records.find((r) => r.id === id)

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Recipe not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error reading recipe:", error)
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to read recipe from local database",
      },
      { status: 500 },
    )
  }
}
