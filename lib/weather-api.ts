"use server"

interface WeatherData {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  pressure: number
  location: string
  icon: string
  feelsLike: number
  visibility: number
  uvIndex: number
  sunrise?: string
  sunset?: string
  windDirection?: number
  cloudCover?: number
}

interface ForecastData {
  date: string
  temperature: {
    min: number
    max: number
  }
  description: string
  icon: string
  humidity: number
  windSpeed: number
  precipitation?: number
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY

  // Always try OpenWeather API first if key is available
  if (apiKey) {
    try {
      console.log(`🌤️ Fetching detailed weather for ${lat}, ${lon} using OpenWeather API`)

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
        {
          next: { revalidate: 300 }, // Cache for 5 minutes
          headers: {
            "User-Agent": "CropLink-Weather-App/1.0",
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ OpenWeather API success: ${data.name}, ${data.main.temp}°C`)

        // Calculate sunrise/sunset times
        const sunrise = data.sys.sunrise
          ? new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : undefined
        const sunset = data.sys.sunset
          ? new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : undefined

        return {
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          windDirection: data.wind.deg,
          pressure: data.main.pressure,
          location: data.name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
          icon: data.weather[0].icon,
          feelsLike: Math.round(data.main.feels_like),
          visibility: Math.round((data.visibility || 10000) / 1000),
          uvIndex: 0, // Would need separate UV API call
          cloudCover: data.clouds?.all,
          sunrise,
          sunset,
        }
      } else {
        console.warn(`⚠️ OpenWeather API error: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("❌ OpenWeather API error:", error)
    }
  }

  // Fallback to Open-Meteo API (no key required) with more detailed data
  try {
    console.log(`🌤️ Falling back to Open-Meteo API for ${lat}, ${lon}`)

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=sunrise,sunset&timezone=auto`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
        headers: {
          "User-Agent": "CropLink-Weather-App/1.0",
        },
      },
    )

    if (!response.ok) {
      console.error(`❌ Open-Meteo API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    const current = data.current
    const daily = data.daily
    console.log(`✅ Open-Meteo API success: ${current.temperature_2m}°C`)

    // Format sunrise/sunset times
    const sunrise = daily.sunrise?.[0]
      ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : undefined
    const sunset = daily.sunset?.[0]
      ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : undefined

    return {
      temperature: Math.round(current.temperature_2m),
      description: getWeatherDescription(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 3.6), // Convert m/s to km/h
      windDirection: current.wind_direction_10m,
      pressure: Math.round(current.surface_pressure),
      location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      icon: getWeatherIcon(current.weather_code),
      feelsLike: Math.round(current.apparent_temperature),
      visibility: 10, // Default visibility
      uvIndex: 0,
      cloudCover: current.cloud_cover,
      sunrise,
      sunset,
    }
  } catch (error) {
    console.error("❌ Open-Meteo API error:", error)
    return null
  }
}

export async function getWeatherForecast(lat: number, lon: number): Promise<ForecastData[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY

  // Try OpenWeather API first if key is available
  if (apiKey) {
    try {
      console.log(`📅 Fetching detailed forecast for ${lat}, ${lon} using OpenWeather API`)

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
        {
          next: { revalidate: 600 }, // Cache for 10 minutes
          headers: {
            "User-Agent": "CropLink-Weather-App/1.0",
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        const dailyData: { [key: string]: any } = {}

        data.list.forEach((item: any) => {
          const date = item.dt_txt.split(" ")[0]
          if (!dailyData[date]) {
            dailyData[date] = {
              temps: [],
              humidity: item.main.humidity,
              windSpeed: item.wind.speed * 3.6,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              precipitation: 0,
            }
          }
          dailyData[date].temps.push(item.main.temp)

          // Calculate precipitation probability
          if (item.pop) {
            dailyData[date].precipitation = Math.max(dailyData[date].precipitation, Math.round(item.pop * 100))
          }
        })

        const forecast = Object.entries(dailyData)
          .slice(0, 7) // Get 7 days
          .map(([date, data]: [string, any]) => ({
            date,
            temperature: {
              min: Math.round(Math.min(...data.temps)),
              max: Math.round(Math.max(...data.temps)),
            },
            description: data.description,
            icon: data.icon,
            humidity: data.humidity,
            windSpeed: Math.round(data.windSpeed),
            precipitation: data.precipitation,
          }))

        console.log(`✅ OpenWeather forecast success: ${forecast.length} days`)
        return forecast
      } else {
        console.warn(`⚠️ OpenWeather forecast API error: ${response.status}`)
      }
    } catch (error) {
      console.error("❌ OpenWeather forecast API error:", error)
    }
  }

  // Fallback to Open-Meteo API with detailed forecast
  try {
    console.log(`📅 Falling back to Open-Meteo forecast API for ${lat}, ${lon}`)

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m,wind_speed_10m_max,weather_code,precipitation_probability_max&timezone=auto&forecast_days=7`,
      {
        next: { revalidate: 600 }, // Cache for 10 minutes
        headers: {
          "User-Agent": "CropLink-Weather-App/1.0",
        },
      },
    )

    if (!response.ok) {
      console.error(`❌ Open-Meteo forecast API error: ${response.status}`)
      return []
    }

    const data = await response.json()
    const daily = data.daily

    const forecast = daily.time.map((date: string, index: number) => ({
      date,
      temperature: {
        min: Math.round(daily.temperature_2m_min[index]),
        max: Math.round(daily.temperature_2m_max[index]),
      },
      description: getWeatherDescription(daily.weather_code[index]),
      icon: getWeatherIcon(daily.weather_code[index]),
      humidity: daily.relative_humidity_2m[index],
      windSpeed: Math.round(daily.wind_speed_10m_max[index] * 3.6),
      precipitation: daily.precipitation_probability_max?.[index] || 0,
    }))

    console.log(`✅ Open-Meteo forecast success: ${forecast.length} days`)
    return forecast
  } catch (error) {
    console.error("❌ Open-Meteo forecast API error:", error)
    return []
  }
}

function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  }
  return descriptions[code] || "Unknown weather"
}

function getWeatherIcon(code: number): string {
  const icons: { [key: number]: string } = {
    0: "01d", // Clear sky
    1: "02d", // Mainly clear
    2: "03d", // Partly cloudy
    3: "04d", // Overcast
    45: "50d", // Fog
    48: "50d", // Depositing rime fog
    51: "09d", // Light drizzle
    53: "09d", // Moderate drizzle
    55: "09d", // Dense drizzle
    56: "09d", // Light freezing drizzle
    57: "09d", // Dense freezing drizzle
    61: "10d", // Slight rain
    63: "10d", // Moderate rain
    65: "10d", // Heavy rain
    66: "10d", // Light freezing rain
    67: "10d", // Heavy freezing rain
    71: "13d", // Slight snow fall
    73: "13d", // Moderate snow fall
    75: "13d", // Heavy snow fall
    77: "13d", // Snow grains
    80: "09d", // Slight rain showers
    81: "09d", // Moderate rain showers
    82: "09d", // Violent rain showers
    85: "13d", // Slight snow showers
    86: "13d", // Heavy snow showers
    95: "11d", // Thunderstorm
    96: "11d", // Thunderstorm with slight hail
    99: "11d", // Thunderstorm with heavy hail
  }
  return icons[code] || "01d"
}
