import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Signup API is working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
  })
}

export async function POST() {
  return NextResponse.json({
    message: "POST method is working",
    timestamp: new Date().toISOString(),
  })
}
