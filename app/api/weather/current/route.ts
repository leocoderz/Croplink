import { type NextRequest, NextResponse } from "next/server"
import { getCurrentWeather } from "@/lib/weather-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = Number.parseFloat(searchParams.get("lat") || "0")
    const lon = Number.parseFloat(searchParams.get("lon") || "0")

    if (!lat || !lon) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    const weather = await getCurrentWeather(lat, lon)

    if (!weather) {
      return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
    }

    return NextResponse.json(weather)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
