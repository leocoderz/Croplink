// Import the env configuration
import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"
import { env } from "@/lib/env"

// Initialize the SQL client with proper error handling
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

export async function POST(request: NextRequest) {
  try {
    // Check if database connection is available
    if (!sql) {
      console.error("Database connection not available. DATABASE_URL environment variable is missing.")
      return NextResponse.json({ message: "Database configuration error" }, { status: 500 })
    }

    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as any
    const userId = decoded.userId

    const { activityType, activityData } = await request.json()

    // Log user activity
    await sql`
      INSERT INTO user_activities (user_id, activity_type, activity_data, created_at)
      VALUES (${userId}, ${activityType}, ${JSON.stringify(activityData)}, NOW())
    `

    return NextResponse.json({
      success: true,
      message: "Activity logged successfully",
    })
  } catch (error: any) {
    console.error("Activity logging error:", error)
    return NextResponse.json({ message: "Failed to log activity", error: error.message }, { status: 500 })
  }
}
