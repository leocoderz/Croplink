import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("🔍 Debug endpoint called")

  return NextResponse.json({
    message: "Debug endpoint working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasJwtSecret: !!process.env.JWT_SECRET,
    origin: request.nextUrl.origin,
    userAgent: request.headers.get("user-agent"),
  })
}

export async function POST(request: NextRequest) {
  console.log("🔍 Debug POST endpoint called")

  try {
    const body = await request.json()
    console.log("📝 Debug request body:", body)

    return NextResponse.json({
      message: "Debug POST working",
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Debug POST error:", error)
    return NextResponse.json(
      {
        message: "Debug POST failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
