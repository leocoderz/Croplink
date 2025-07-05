import { type NextRequest, NextResponse } from "next/server"
import { getWeatherForecast } from "@/lib/weather-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = Number.parseFloat(searchParams.get("lat") || "0")
    const lon = Number.parseFloat(searchParams.get("lon") || "0")

    if (!lat || !lon) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    const forecast = await getWeatherForecast(lat, lon)

    return NextResponse.json(forecast)
  } catch (error) {
    console.error("Weather forecast API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
