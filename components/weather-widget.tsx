"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Cloud,
  Sun,
  CloudRain,
  Droplets,
  Wind,
  Eye,
  Gauge,
  RefreshCw,
  MapPin,
  Calendar,
  AlertTriangle,
  Loader2,
  Plus,
  Search,
  CloudSnow,
  Settings,
  Star,
  Sunrise,
  Sunset,
  Sprout,
  Tractor,
  Shield,
  Navigation,
  Trash2,
} from "lucide-react"

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

interface LocationData {
  id: string
  name: string
  latitude: number
  longitude: number
  isDefault: boolean
  weather?: WeatherData
  forecast?: ForecastData[]
  lastUpdated?: string
}

interface FarmingAdvice {
  irrigation: string
  planting: string
  harvesting: string
  pestControl: string
  fieldWork: string
  priority: "low" | "medium" | "high"
}

interface WeatherWidgetProps {
  onNotification?: (notification: any) => void
}

// Popular Indian cities with coordinates
const POPULAR_INDIAN_CITIES = [
  { id: "delhi", name: "New Delhi, Delhi", latitude: 28.6139, longitude: 77.209 },
  { id: "mumbai", name: "Mumbai, Maharashtra", latitude: 19.076, longitude: 72.8777 },
  { id: "bangalore", name: "Bangalore, Karnataka", latitude: 12.9716, longitude: 77.5946 },
  { id: "chennai", name: "Chennai, Tamil Nadu", latitude: 13.0827, longitude: 80.2707 },
  { id: "kolkata", name: "Kolkata, West Bengal", latitude: 22.5726, longitude: 88.3639 },
  { id: "hyderabad", name: "Hyderabad, Telangana", latitude: 17.385, longitude: 78.4867 },
  { id: "pune", name: "Pune, Maharashtra", latitude: 18.5204, longitude: 73.8567 },
  { id: "ahmedabad", name: "Ahmedabad, Gujarat", latitude: 23.0225, longitude: 72.5714 },
  { id: "jaipur", name: "Jaipur, Rajasthan", latitude: 26.9124, longitude: 75.7873 },
  { id: "lucknow", name: "Lucknow, Uttar Pradesh", latitude: 26.8467, longitude: 80.9462 },
  { id: "kanpur", name: "Kanpur, Uttar Pradesh", latitude: 26.4499, longitude: 80.3319 },
  { id: "nagpur", name: "Nagpur, Maharashtra", latitude: 21.1458, longitude: 79.0882 },
  { id: "indore", name: "Indore, Madhya Pradesh", latitude: 22.7196, longitude: 75.8577 },
  { id: "thane", name: "Thane, Maharashtra", latitude: 19.2183, longitude: 72.9781 },
  { id: "bhopal", name: "Bhopal, Madhya Pradesh", latitude: 23.2599, longitude: 77.4126 },
  { id: "visakhapatnam", name: "Visakhapatnam, Andhra Pradesh", latitude: 17.6868, longitude: 83.2185 },
  { id: "pimpri", name: "Pimpri-Chinchwad, Maharashtra", latitude: 18.6298, longitude: 73.7997 },
  { id: "patna", name: "Patna, Bihar", latitude: 25.5941, longitude: 85.1376 },
  { id: "vadodara", name: "Vadodara, Gujarat", latitude: 22.3072, longitude: 73.1812 },
  { id: "ghaziabad", name: "Ghaziabad, Uttar Pradesh", latitude: 28.6692, longitude: 77.4538 },
  { id: "ludhiana", name: "Ludhiana, Punjab", latitude: 30.901, longitude: 75.8573 },
  { id: "agra", name: "Agra, Uttar Pradesh", latitude: 27.1767, longitude: 78.0081 },
  { id: "nashik", name: "Nashik, Maharashtra", latitude: 19.9975, longitude: 73.7898 },
  { id: "faridabad", name: "Faridabad, Haryana", latitude: 28.4089, longitude: 77.3178 },
  { id: "meerut", name: "Meerut, Uttar Pradesh", latitude: 28.9845, longitude: 77.7064 },
  { id: "rajkot", name: "Rajkot, Gujarat", latitude: 22.3039, longitude: 70.8022 },
  { id: "kalyan", name: "Kalyan-Dombivali, Maharashtra", latitude: 19.2403, longitude: 73.1305 },
  { id: "vasai", name: "Vasai-Virar, Maharashtra", latitude: 19.4914, longitude: 72.8054 },
  { id: "varanasi", name: "Varanasi, Uttar Pradesh", latitude: 25.3176, longitude: 82.9739 },
  { id: "srinagar", name: "Srinagar, Jammu and Kashmir", latitude: 34.0837, longitude: 74.7973 },
  { id: "aurangabad", name: "Aurangabad, Maharashtra", latitude: 19.8762, longitude: 75.3433 },
  { id: "dhanbad", name: "Dhanbad, Jharkhand", latitude: 23.7957, longitude: 86.4304 },
  { id: "amritsar", name: "Amritsar, Punjab", latitude: 31.622, longitude: 74.8723 },
  { id: "navi-mumbai", name: "Navi Mumbai, Maharashtra", latitude: 19.033, longitude: 73.0297 },
  { id: "allahabad", name: "Prayagraj, Uttar Pradesh", latitude: 25.4358, longitude: 81.8463 },
  { id: "ranchi", name: "Ranchi, Jharkhand", latitude: 23.3441, longitude: 85.3096 },
  { id: "howrah", name: "Howrah, West Bengal", latitude: 22.5958, longitude: 88.2636 },
  { id: "coimbatore", name: "Coimbatore, Tamil Nadu", latitude: 11.0168, longitude: 76.9558 },
  { id: "jabalpur", name: "Jabalpur, Madhya Pradesh", latitude: 23.1815, longitude: 79.9864 },
  { id: "gwalior", name: "Gwalior, Madhya Pradesh", latitude: 26.2183, longitude: 78.1828 },
  { id: "vijayawada", name: "Vijayawada, Andhra Pradesh", latitude: 16.5062, longitude: 80.648 },
  { id: "jodhpur", name: "Jodhpur, Rajasthan", latitude: 26.2389, longitude: 73.0243 },
  { id: "madurai", name: "Madurai, Tamil Nadu", latitude: 9.9252, longitude: 78.1198 },
  { id: "raipur", name: "Raipur, Chhattisgarh", latitude: 21.2514, longitude: 81.6296 },
  { id: "kota", name: "Kota, Rajasthan", latitude: 25.2138, longitude: 75.8648 },
  { id: "chandigarh", name: "Chandigarh", latitude: 30.7333, longitude: 76.7794 },
  { id: "guwahati", name: "Guwahati, Assam", latitude: 26.1445, longitude: 91.7362 },
  { id: "solapur", name: "Solapur, Maharashtra", latitude: 17.6599, longitude: 75.9064 },
  { id: "hubli", name: "Hubli-Dharwad, Karnataka", latitude: 15.3647, longitude: 75.124 },
  { id: "bareilly", name: "Bareilly, Uttar Pradesh", latitude: 28.367, longitude: 79.4304 },
  { id: "moradabad", name: "Moradabad, Uttar Pradesh", latitude: 28.8386, longitude: 78.7733 },
  { id: "mysore", name: "Mysuru, Karnataka", latitude: 12.2958, longitude: 76.6394 },
  { id: "gurgaon", name: "Gurugram, Haryana", latitude: 28.4595, longitude: 77.0266 },
  { id: "aligarh", name: "Aligarh, Uttar Pradesh", latitude: 27.8974, longitude: 78.088 },
  { id: "jalandhar", name: "Jalandhar, Punjab", latitude: 31.326, longitude: 75.5762 },
  { id: "tiruchirappalli", name: "Tiruchirappalli, Tamil Nadu", latitude: 10.7905, longitude: 78.7047 },
  { id: "bhubaneswar", name: "Bhubaneswar, Odisha", latitude: 20.2961, longitude: 85.8245 },
  { id: "salem", name: "Salem, Tamil Nadu", latitude: 11.664, longitude: 78.146 },
  { id: "warangal", name: "Warangal, Telangana", latitude: 17.9689, longitude: 79.5941 },
  { id: "mira-bhayandar", name: "Mira-Bhayandar, Maharashtra", latitude: 19.2952, longitude: 72.8544 },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram, Kerala", latitude: 8.5241, longitude: 76.9366 },
  { id: "bhiwandi", name: "Bhiwandi, Maharashtra", latitude: 19.3002, longitude: 73.0635 },
  { id: "saharanpur", name: "Saharanpur, Uttar Pradesh", latitude: 29.968, longitude: 77.5552 },
  { id: "guntur", name: "Guntur, Andhra Pradesh", latitude: 16.3067, longitude: 80.4365 },
  { id: "amravati", name: "Amravati, Maharashtra", latitude: 20.9374, longitude: 77.7796 },
  { id: "bikaner", name: "Bikaner, Rajasthan", latitude: 28.0229, longitude: 73.3119 },
  { id: "noida", name: "Noida, Uttar Pradesh", latitude: 28.5355, longitude: 77.391 },
  { id: "jamshedpur", name: "Jamshedpur, Jharkhand", latitude: 22.8046, longitude: 86.2029 },
  { id: "bhilai", name: "Bhilai, Chhattisgarh", latitude: 21.1938, longitude: 81.3509 },
  { id: "cuttack", name: "Cuttack, Odisha", latitude: 20.4625, longitude: 85.8828 },
  { id: "firozabad", name: "Firozabad, Uttar Pradesh", latitude: 27.1592, longitude: 78.3957 },
  { id: "kochi", name: "Kochi, Kerala", latitude: 9.9312, longitude: 76.2673 },
  { id: "nellore", name: "Nellore, Andhra Pradesh", latitude: 14.4426, longitude: 79.9865 },
  { id: "bhavnagar", name: "Bhavnagar, Gujarat", latitude: 21.7645, longitude: 72.1519 },
  { id: "dehradun", name: "Dehradun, Uttarakhand", latitude: 30.3165, longitude: 78.0322 },
  { id: "durgapur", name: "Durgapur, West Bengal", latitude: 23.5204, longitude: 87.3119 },
  { id: "asansol", name: "Asansol, West Bengal", latitude: 23.6739, longitude: 86.9524 },
  { id: "rourkela", name: "Rourkela, Odisha", latitude: 22.2604, longitude: 84.8536 },
  { id: "nanded", name: "Nanded, Maharashtra", latitude: 19.1383, longitude: 77.321 },
  { id: "kolhapur", name: "Kolhapur, Maharashtra", latitude: 16.705, longitude: 74.2433 },
  { id: "ajmer", name: "Ajmer, Rajasthan", latitude: 26.4499, longitude: 74.6399 },
  { id: "akola", name: "Akola, Maharashtra", latitude: 20.7002, longitude: 77.0082 },
  { id: "gulbarga", name: "Kalaburagi, Karnataka", latitude: 17.3297, longitude: 76.8343 },
  { id: "jamnagar", name: "Jamnagar, Gujarat", latitude: 22.4707, longitude: 70.0577 },
  { id: "ujjain", name: "Ujjain, Madhya Pradesh", latitude: 23.1765, longitude: 75.7885 },
  { id: "loni", name: "Loni, Uttar Pradesh", latitude: 28.7333, longitude: 77.2833 },
  { id: "siliguri", name: "Siliguri, West Bengal", latitude: 26.7271, longitude: 88.3953 },
  { id: "jhansi", name: "Jhansi, Uttar Pradesh", latitude: 25.4484, longitude: 78.5685 },
  { id: "ulhasnagar", name: "Ulhasnagar, Maharashtra", latitude: 19.2215, longitude: 73.1645 },
  { id: "jammu", name: "Jammu, Jammu and Kashmir", latitude: 32.7266, longitude: 74.857 },
  { id: "sangli-miraj-kupwad", name: "Sangli, Maharashtra", latitude: 16.8524, longitude: 74.5815 },
  { id: "mangalore", name: "Mangaluru, Karnataka", latitude: 12.9141, longitude: 74.856 },
  { id: "erode", name: "Erode, Tamil Nadu", latitude: 11.341, longitude: 77.7172 },
  { id: "belgaum", name: "Belagavi, Karnataka", latitude: 15.8497, longitude: 74.4977 },
  { id: "ambattur", name: "Ambattur, Tamil Nadu", latitude: 13.1143, longitude: 80.1548 },
  { id: "tirunelveli", name: "Tirunelveli, Tamil Nadu", latitude: 8.7139, longitude: 77.7567 },
  { id: "malegaon", name: "Malegaon, Maharashtra", latitude: 20.5579, longitude: 74.5287 },
  { id: "gaya", name: "Gaya, Bihar", latitude: 24.7914, longitude: 85.0002 },
  { id: "jalgaon", name: "Jalgaon, Maharashtra", latitude: 21.0077, longitude: 75.5626 },
  { id: "udaipur", name: "Udaipur, Rajasthan", latitude: 24.5854, longitude: 73.7125 },
  { id: "maheshtala", name: "Maheshtala, West Bengal", latitude: 22.4986, longitude: 88.2475 },
]

export function WeatherWidget({ onNotification }: WeatherWidgetProps) {
  const [locations, setLocations] = useState<LocationData[]>([])
  const [selectedLocationId, setSelectedLocationId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  // Generate farming advice based on weather conditions
  const generateFarmingAdvice = useCallback((weather: WeatherData, forecast: ForecastData[]): FarmingAdvice => {
    const temp = weather.temperature
    const humidity = weather.humidity
    const windSpeed = weather.windSpeed
    const description = weather.description.toLowerCase()

    // Check upcoming rain in forecast
    const upcomingRain = forecast
      .slice(0, 3)
      .some((day) => day.description.toLowerCase().includes("rain") || (day.precipitation && day.precipitation > 30))

    let irrigation = ""
    let planting = ""
    let harvesting = ""
    let pestControl = ""
    let fieldWork = ""
    let priority: "low" | "medium" | "high" = "low"

    // Temperature-based advice
    if (temp > 35) {
      irrigation =
        "High temperature alert! Increase irrigation frequency. Water early morning or evening to reduce evaporation."
      fieldWork = "Avoid heavy field work during peak hours (10 AM - 4 PM). Schedule work for early morning or evening."
      priority = "high"
    } else if (temp > 30) {
      irrigation = "Warm conditions - monitor soil moisture closely. Consider drip irrigation for water efficiency."
      fieldWork = "Good conditions for field work, but take breaks during midday heat."
      priority = "medium"
    } else if (temp < 10) {
      planting = "Cold conditions - protect sensitive crops from frost. Consider row covers or greenhouse protection."
      irrigation = "Reduce irrigation frequency as evaporation is low. Check for frost damage."
      priority = "high"
    } else if (temp >= 15 && temp <= 25) {
      planting = "Ideal temperature for most crop planting and transplanting activities."
      fieldWork = "Excellent conditions for all field operations including planting, weeding, and harvesting."
      priority = "low"
    }

    // Humidity-based advice
    if (humidity > 80) {
      pestControl = "High humidity increases disease risk. Monitor for fungal infections. Ensure good air circulation."
      if (temp > 25) {
        pestControl += " Consider preventive fungicide application."
        priority = "high"
      }
    } else if (humidity < 30) {
      irrigation = (irrigation || "") + " Low humidity - increase watering frequency to prevent plant stress."
      pestControl = "Low humidity may increase pest activity. Monitor for spider mites and aphids."
    }

    // Wind-based advice
    if (windSpeed > 25) {
      fieldWork = "Strong winds - avoid spraying pesticides or fertilizers. Secure lightweight structures."
      harvesting = "Delay harvesting of tall crops to prevent lodging. Check for wind damage."
      priority = "high"
    } else if (windSpeed > 15) {
      fieldWork = "Moderate winds - good for drying harvested crops but be cautious with spraying."
    }

    // Weather condition-based advice
    if (description.includes("rain") || description.includes("drizzle")) {
      irrigation = "Natural irrigation from rain. Reduce or skip watering. Check drainage to prevent waterlogging."
      fieldWork = "Avoid heavy machinery on wet soil to prevent compaction. Good time for indoor farm tasks."
      planting = "Excellent conditions for seed germination after rain stops."
      priority = "medium"
    } else if (description.includes("storm") || description.includes("thunder")) {
      fieldWork = "Severe weather - avoid all outdoor activities. Secure equipment and protect crops if possible."
      harvesting = "Postpone harvesting until weather clears. Check for hail or wind damage after storm."
      priority = "high"
    } else if (description.includes("clear") || description.includes("sunny")) {
      harvesting = "Ideal conditions for harvesting and drying crops. Good visibility for quality assessment."
      fieldWork = "Perfect weather for all field operations. Plan major activities today."
      if (temp > 30) {
        irrigation = "Sunny and warm - monitor soil moisture. Water deeply but less frequently."
      }
    }

    // Forecast-based advice
    if (upcomingRain) {
      if (!description.includes("rain")) {
        irrigation = "Rain expected in next 2-3 days. Reduce current irrigation to prevent overwatering."
        harvesting = "Consider harvesting mature crops before rain to prevent quality loss."
        fieldWork = "Complete urgent field work before rain arrives. Prepare drainage systems."
        priority = "medium"
      }
    }

    // Default advice if none set
    if (!irrigation) irrigation = "Monitor soil moisture regularly. Water when top 2-3 inches of soil are dry."
    if (!planting) planting = "Check soil temperature and moisture before planting. Follow crop-specific guidelines."
    if (!harvesting) harvesting = "Harvest crops at optimal maturity. Check market prices for best timing."
    if (!pestControl) pestControl = "Regular monitoring for pests and diseases. Early detection is key."
    if (!fieldWork) fieldWork = "Good conditions for routine farm maintenance and field operations."

    return {
      irrigation,
      planting,
      harvesting,
      pestControl,
      fieldWork,
      priority,
    }
  }, [])

  // Load saved locations from localStorage
  const loadSavedLocations = useCallback(() => {
    try {
      const saved = localStorage.getItem("croplink-weather-locations")
      if (saved) {
        const parsedLocations = JSON.parse(saved)
        console.log("📍 Loaded saved locations:", parsedLocations.length)
        setLocations(parsedLocations)

        // Set default location
        const defaultLocation = parsedLocations.find((loc: LocationData) => loc.isDefault)
        if (defaultLocation) {
          setSelectedLocationId(defaultLocation.id)
        } else if (parsedLocations.length > 0) {
          setSelectedLocationId(parsedLocations[0].id)
        }
        return parsedLocations
      }
    } catch (error) {
      console.error("❌ Failed to load saved locations:", error)
    }
    return []
  }, [])

  // Save locations to localStorage
  const saveLocations = useCallback((locationsToSave: LocationData[]) => {
    try {
      localStorage.setItem("croplink-weather-locations", JSON.stringify(locationsToSave))
      console.log("💾 Saved locations:", locationsToSave.length)
    } catch (error) {
      console.error("❌ Failed to save locations:", error)
    }
  }, [])

  // Get user's current location
  const getCurrentLocation = useCallback((): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Geolocation error:", error)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }, [])

  // Fetch weather data for a location
  const fetchWeatherData = useCallback(
    async (latitude: number, longitude: number): Promise<{ weather: WeatherData; forecast: ForecastData[] }> => {
      try {
        console.log(`🌤️ Fetching weather for ${latitude}, ${longitude}`)

        // Try OpenWeather API first
        try {
          const [currentResponse, forecastResponse] = await Promise.all([
            fetch(`/api/weather/current?lat=${latitude}&lon=${longitude}`),
            fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`),
          ])

          if (currentResponse.ok && forecastResponse.ok) {
            const [currentData, forecastData] = await Promise.all([currentResponse.json(), forecastResponse.json()])

            console.log("✅ OpenWeather API success")
            return {
              weather: currentData,
              forecast: forecastData,
            }
          }
        } catch (openWeatherError) {
          console.log("⚠️ OpenWeather API failed, trying fallback...")
        }

        // Fallback to Open-Meteo API
        const [currentResponse, forecastResponse] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,pressure_msl&timezone=auto`,
          ),
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m,wind_speed_10m_max&timezone=auto&forecast_days=7`,
          ),
        ])

        if (!currentResponse.ok || !forecastResponse.ok) {
          throw new Error("Failed to fetch weather data from fallback API")
        }

        const [currentData, forecastData] = await Promise.all([currentResponse.json(), forecastResponse.json()])

        // Convert Open-Meteo data to our format
        const weatherCodeMap: { [key: number]: { description: string; icon: string } } = {
          0: { description: "Clear sky", icon: "01d" },
          1: { description: "Mainly clear", icon: "01d" },
          2: { description: "Partly cloudy", icon: "02d" },
          3: { description: "Overcast", icon: "03d" },
          45: { description: "Foggy", icon: "50d" },
          48: { description: "Depositing rime fog", icon: "50d" },
          51: { description: "Light drizzle", icon: "09d" },
          53: { description: "Moderate drizzle", icon: "09d" },
          55: { description: "Dense drizzle", icon: "09d" },
          61: { description: "Slight rain", icon: "10d" },
          63: { description: "Moderate rain", icon: "10d" },
          65: { description: "Heavy rain", icon: "10d" },
          71: { description: "Slight snow", icon: "13d" },
          73: { description: "Moderate snow", icon: "13d" },
          75: { description: "Heavy snow", icon: "13d" },
          95: { description: "Thunderstorm", icon: "11d" },
        }

        const weatherInfo = weatherCodeMap[currentData.current.weather_code] || {
          description: "Unknown",
          icon: "01d",
        }

        // Get location name using reverse geocoding
        let locationName = "Unknown Location"
        try {
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )
          if (geoResponse.ok) {
            const geoData = await geoResponse.json()
            locationName = geoData.city || geoData.locality || geoData.principalSubdivision || "Unknown Location"
          }
        } catch (geoError) {
          console.log("⚠️ Geocoding failed, using coordinates")
          locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
        }

        const weather: WeatherData = {
          temperature: Math.round(currentData.current.temperature_2m),
          description: weatherInfo.description,
          humidity: currentData.current.relative_humidity_2m,
          windSpeed: Math.round(currentData.current.wind_speed_10m * 3.6), // Convert m/s to km/h
          pressure: Math.round(currentData.current.pressure_msl),
          location: locationName,
          icon: weatherInfo.icon,
          feelsLike: Math.round(currentData.current.temperature_2m), // Approximation
          visibility: 10, // Default value
          uvIndex: 5, // Default value
        }

        const forecast: ForecastData[] = forecastData.daily.time.slice(1, 8).map((date: string, index: number) => ({
          date,
          temperature: {
            min: Math.round(forecastData.daily.temperature_2m_min[index + 1]),
            max: Math.round(forecastData.daily.temperature_2m_max[index + 1]),
          },
          description: (weatherCodeMap[forecastData.daily.weather_code[index + 1]] || weatherCodeMap[0]).description,
          icon: (weatherCodeMap[forecastData.daily.weather_code[index + 1]] || weatherCodeMap[0]).icon,
          humidity: forecastData.daily.relative_humidity_2m?.[index + 1] || 50,
          windSpeed: Math.round((forecastData.daily.wind_speed_10m_max?.[index + 1] || 0) * 3.6),
        }))

        console.log("✅ Open-Meteo API success")
        return { weather, forecast }
      } catch (error) {
        console.error("❌ Weather fetch error:", error)
        throw error
      }
    },
    [],
  )

  // Search for locations (now includes popular Indian cities)
  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      // First, search in popular Indian cities
      const popularResults = POPULAR_INDIAN_CITIES.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 5)

      // If we have popular results, use them
      if (popularResults.length > 0) {
        setSearchResults(
          popularResults.map((city) => ({
            id: city.id,
            name: city.name,
            latitude: city.latitude,
            longitude: city.longitude,
            type: "popular",
            importance: 1,
          })),
        )
        setSearching(false)
        return
      }

      // Otherwise, try OpenStreetMap Nominatim API for broader search
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=in`,
        )

        if (response.ok) {
          const data = await response.json()
          const results = data.map((item: any) => ({
            id: item.place_id.toString(),
            name: item.display_name,
            latitude: Number.parseFloat(item.lat),
            longitude: Number.parseFloat(item.lon),
            type: item.type,
            importance: item.importance,
          }))
          setSearchResults(results)
        } else {
          // Fallback to showing popular cities that partially match
          const fallbackResults = POPULAR_INDIAN_CITIES.filter((city) =>
            city.name.toLowerCase().includes(query.toLowerCase().substring(0, 3)),
          ).slice(0, 8)

          setSearchResults(
            fallbackResults.map((city) => ({
              id: city.id,
              name: city.name,
              latitude: city.latitude,
              longitude: city.longitude,
              type: "popular",
              importance: 1,
            })),
          )
        }
      } catch (apiError) {
        console.log("⚠️ API search failed, showing popular cities")
        // Show popular cities as fallback
        const fallbackResults = POPULAR_INDIAN_CITIES.slice(0, 10)
        setSearchResults(
          fallbackResults.map((city) => ({
            id: city.id,
            name: city.name,
            latitude: city.latitude,
            longitude: city.longitude,
            type: "popular",
            importance: 1,
          })),
        )
      }
    } catch (error) {
      console.error("Location search error:", error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  // Add a new location
  const addLocation = useCallback(
    async (locationData: { name: string; latitude: number; longitude: number }) => {
      try {
        console.log("🔄 Adding location:", locationData.name)
        setSearching(true)

        const { weather, forecast } = await fetchWeatherData(locationData.latitude, locationData.longitude)

        const newLocation: LocationData = {
          id: Date.now().toString(),
          name: locationData.name,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          isDefault: locations.length === 0, // First location is default
          weather,
          forecast,
          lastUpdated: new Date().toISOString(),
        }

        const updatedLocations = [...locations, newLocation]
        setLocations(updatedLocations)
        saveLocations(updatedLocations)

        if (locations.length === 0) {
          setSelectedLocationId(newLocation.id)
        }

        setShowAddLocation(false)
        setSearchQuery("")
        setSearchResults([])

        onNotification?.({
          title: "Location Added",
          message: `${locationData.name} has been added to your weather locations.`,
          type: "success",
        })

        console.log("✅ Location added successfully:", locationData.name)
      } catch (error) {
        console.error("❌ Failed to add location:", error)
        setError("Failed to add location. Please try again.")

        onNotification?.({
          title: "Error Adding Location",
          message: "Failed to add location. Please check your internet connection and try again.",
          type: "warning",
        })
      } finally {
        setSearching(false)
      }
    },
    [locations, fetchWeatherData, saveLocations, onNotification],
  )

  // Remove a location
  const removeLocation = useCallback(
    (locationId: string) => {
      const updatedLocations = locations.filter((loc) => loc.id !== locationId)
      setLocations(updatedLocations)
      saveLocations(updatedLocations)

      if (selectedLocationId === locationId) {
        setSelectedLocationId(updatedLocations.length > 0 ? updatedLocations[0].id : "")
      }

      onNotification?.({
        title: "Location Removed",
        message: "Location has been removed from your weather list.",
        type: "success",
      })
    },
    [locations, selectedLocationId, saveLocations, onNotification],
  )

  // Set default location
  const setDefaultLocation = useCallback(
    (locationId: string) => {
      const updatedLocations = locations.map((loc) => ({
        ...loc,
        isDefault: loc.id === locationId,
      }))
      setLocations(updatedLocations)
      saveLocations(updatedLocations)

      onNotification?.({
        title: "Default Location Set",
        message: "Default weather location has been updated.",
        type: "success",
      })
    },
    [locations, saveLocations, onNotification],
  )

  // Refresh weather data for all locations
  const refreshWeatherData = useCallback(async () => {
    if (locations.length === 0) return

    setRefreshing(true)
    try {
      const updatedLocations = await Promise.all(
        locations.map(async (location) => {
          try {
            const { weather, forecast } = await fetchWeatherData(location.latitude, location.longitude)
            return {
              ...location,
              weather,
              forecast,
              lastUpdated: new Date().toISOString(),
            }
          } catch (error) {
            console.error(`Failed to update weather for ${location.name}:`, error)
            return location // Keep old data if update fails
          }
        }),
      )

      setLocations(updatedLocations)
      saveLocations(updatedLocations)

      onNotification?.({
        title: "Weather Updated",
        message: "Weather data has been refreshed for all locations.",
        type: "success",
      })
    } catch (error) {
      console.error("Failed to refresh weather data:", error)
      setError("Failed to refresh weather data")
    } finally {
      setRefreshing(false)
    }
  }, [locations, fetchWeatherData, saveLocations, onNotification])

  // Initialize weather data
  useEffect(() => {
    const initializeWeather = async () => {
      setLoading(true)
      setError(null)

      try {
        // Load saved locations first
        const savedLocations = loadSavedLocations()

        if (savedLocations.length > 0) {
          console.log("📍 Using saved locations")
          // Refresh weather data for saved locations
          await refreshWeatherData()
        } else {
          console.log("📍 No saved locations, getting current location")
          // Get current location and add it
          try {
            const { latitude, longitude } = await getCurrentLocation()
            const { weather, forecast } = await fetchWeatherData(latitude, longitude)

            const currentLocation: LocationData = {
              id: "current",
              name: weather.location,
              latitude,
              longitude,
              isDefault: true,
              weather,
              forecast,
              lastUpdated: new Date().toISOString(),
            }

            setLocations([currentLocation])
            saveLocations([currentLocation])
            setSelectedLocationId("current")

            onNotification?.({
              title: "Location Detected",
              message: `Weather loaded for ${weather.location}`,
              type: "success",
            })
          } catch (locationError) {
            console.error("Failed to get current location:", locationError)
            // Add a default location (New Delhi) if geolocation fails
            const defaultLat = 28.6139
            const defaultLon = 77.209

            const { weather, forecast } = await fetchWeatherData(defaultLat, defaultLon)

            const defaultLocation: LocationData = {
              id: "default",
              name: "New Delhi, India",
              latitude: defaultLat,
              longitude: defaultLon,
              isDefault: true,
              weather,
              forecast,
              lastUpdated: new Date().toISOString(),
            }

            setLocations([defaultLocation])
            saveLocations([defaultLocation])
            setSelectedLocationId("default")

            onNotification?.({
              title: "Default Location Loaded",
              message: "Weather loaded for New Delhi (default location)",
              type: "success",
            })
          }
        }
      } catch (error) {
        console.error("Weather initialization error:", error)
        setError("Failed to load weather data. Please check your internet connection.")
      } finally {
        setLoading(false)
      }
    }

    initializeWeather()
  }, []) // Only run once on mount

  // Auto-refresh weather data every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (locations.length > 0) {
        refreshWeatherData()
      }
    }, 600000) // 10 minutes

    return () => clearInterval(interval)
  }, [locations, refreshWeatherData])

  // Search debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchLocations(searchQuery)
      } else {
        // Show popular cities when no search query
        const popularCities = POPULAR_INDIAN_CITIES.slice(0, 12).map((city) => ({
          id: city.id,
          name: city.name,
          latitude: city.latitude,
          longitude: city.longitude,
          type: "popular",
          importance: 1,
        }))
        setSearchResults(popularCities)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, searchLocations])

  const selectedLocation = locations.find((loc) => loc.id === selectedLocationId)
  const currentWeather = selectedLocation?.weather
  const forecast = selectedLocation?.forecast || []
  const farmingAdvice = currentWeather && forecast ? generateFarmingAdvice(currentWeather, forecast) : null

  const getWeatherIcon = (iconCode: string, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-5 w-5",
      md: "h-6 w-6",
      lg: "h-10 w-10",
    }

    const iconMap: { [key: string]: any } = {
      "01d": Sun,
      "01n": Sun,
      "02d": Cloud,
      "02n": Cloud,
      "03d": Cloud,
      "03n": Cloud,
      "04d": Cloud,
      "04n": Cloud,
      "09d": CloudRain,
      "09n": CloudRain,
      "10d": CloudRain,
      "10n": CloudRain,
      "11d": CloudRain,
      "11n": CloudRain,
      "13d": CloudSnow,
      "13n": CloudSnow,
      "50d": Cloud,
      "50n": Cloud,
    }

    const IconComponent = iconMap[iconCode] || Cloud
    return <IconComponent className={sizeClasses[size]} />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 px-3 sm:px-4">
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="text-center">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-blue-500 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading weather data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 px-3 sm:px-4">
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-400">{error}</AlertDescription>
        </Alert>
        <div className="text-center">
          <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-3 sm:px-6 pb-4">
      {/* Header with Location Selector - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Weather</h2>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshWeatherData}
            disabled={refreshing}
            className="bg-white dark:bg-gray-800 flex-shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Dialog open={showAddLocation} onOpenChange={setShowAddLocation}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 flex-shrink-0">
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Add Location</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">Add Weather Location</DialogTitle>
                <DialogDescription className="text-sm">
                  Search and add a new location to track weather data.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search for a city in India..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-base"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {!searchQuery && (
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Popular Indian Cities
                      </div>
                    )}
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:bg-gray-100 dark:active:bg-gray-700"
                        onClick={() => addLocation(result)}
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{result.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {result.latitude.toFixed(2)}, {result.longitude.toFixed(2)}
                              {result.type === "popular" && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">Popular</span>
                              )}
                            </p>
                          </div>
                          <Plus className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery && !searching && searchResults.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No locations found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Location Selector - Mobile Optimized */}
      {locations.length > 1 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Location:</span>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue placeholder="Choose location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        <div className="flex items-center space-x-2">
                          <span className="truncate">{location.name}</span>
                          {location.isDefault && <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {selectedLocation && (
                      <>
                        <DropdownMenuItem onClick={() => setDefaultLocation(selectedLocationId)}>
                          <Star className="h-4 w-4 mr-2" />
                          Set as Default
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => removeLocation(selectedLocationId)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Location
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentWeather && (
        <>
          {/* Current Weather Card - Mobile Optimized */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-blue-100 text-sm sm:text-base truncate">{currentWeather.location}</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">{currentWeather.temperature}°C</div>
                  <div className="text-blue-100 capitalize text-sm sm:text-base">{currentWeather.description}</div>
                  <div className="text-blue-200 text-xs sm:text-sm mt-1">Feels like {currentWeather.feelsLike}°C</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="bg-white/20 p-3 sm:p-4 rounded-full backdrop-blur-sm mb-2 sm:mb-3">
                    {getWeatherIcon(currentWeather.icon, "lg")}
                  </div>
                  <div className="text-blue-200 text-xs sm:text-sm">
                    {selectedLocation?.lastUpdated &&
                      new Date(selectedLocation.lastUpdated).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                    <Droplets className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm text-blue-100">Humidity</span>
                  </div>
                  <div className="text-sm sm:text-lg font-semibold">{currentWeather.humidity}%</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                    <Wind className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm text-blue-100">Wind</span>
                  </div>
                  <div className="text-sm sm:text-lg font-semibold">{currentWeather.windSpeed} km/h</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                    <Gauge className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm text-blue-100">Pressure</span>
                  </div>
                  <div className="text-sm sm:text-lg font-semibold">{currentWeather.pressure} hPa</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farming Advice Card - Mobile Optimized */}
          {farmingAdvice && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Sprout className="h-5 w-5 text-green-600" />
                    <span>AI Farming Advice</span>
                  </CardTitle>
                  <Badge className={getPriorityColor(farmingAdvice.priority)}>
                    {farmingAdvice.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <Tabs defaultValue="irrigation" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 h-auto">
                    <TabsTrigger value="irrigation" className="text-xs p-2 flex flex-col items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      <span className="hidden sm:inline">Irrigation</span>
                      <span className="sm:hidden">Water</span>
                    </TabsTrigger>
                    <TabsTrigger value="planting" className="text-xs p-2 flex flex-col items-center gap-1">
                      <Sprout className="h-3 w-3" />
                      <span className="hidden sm:inline">Planting</span>
                      <span className="sm:hidden">Plant</span>
                    </TabsTrigger>
                    <TabsTrigger value="harvesting" className="text-xs p-2 flex flex-col items-center gap-1">
                      <Tractor className="h-3 w-3" />
                      <span className="hidden sm:inline">Harvest</span>
                      <span className="sm:hidden">Harvest</span>
                    </TabsTrigger>
                    <TabsTrigger value="pest" className="text-xs p-2 flex flex-col items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span className="hidden sm:inline">Pest Control</span>
                      <span className="sm:hidden">Pest</span>
                    </TabsTrigger>
                    <TabsTrigger value="field" className="text-xs p-2 flex flex-col items-center gap-1">
                      <Navigation className="h-3 w-3" />
                      <span className="hidden sm:inline">Field Work</span>
                      <span className="sm:hidden">Field</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="irrigation" className="mt-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2 flex items-center text-sm sm:text-base">
                        <Droplets className="h-4 w-4 mr-2" />
                        Irrigation Guidance
                      </h4>
                      <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
                        {farmingAdvice.irrigation}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="planting" className="mt-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-400 mb-2 flex items-center text-sm sm:text-base">
                        <Sprout className="h-4 w-4 mr-2" />
                        Planting Recommendations
                      </h4>
                      <p className="text-green-800 dark:text-green-300 text-sm leading-relaxed">
                        {farmingAdvice.planting}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="harvesting" className="mt-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-orange-900 dark:text-orange-400 mb-2 flex items-center text-sm sm:text-base">
                        <Tractor className="h-4 w-4 mr-2" />
                        Harvesting Advice
                      </h4>
                      <p className="text-orange-800 dark:text-orange-300 text-sm leading-relaxed">
                        {farmingAdvice.harvesting}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="pest" className="mt-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 dark:text-purple-400 mb-2 flex items-center text-sm sm:text-base">
                        <Shield className="h-4 w-4 mr-2" />
                        Pest & Disease Control
                      </h4>
                      <p className="text-purple-800 dark:text-purple-300 text-sm leading-relaxed">
                        {farmingAdvice.pestControl}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="field" className="mt-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-gray-400 mb-2 flex items-center text-sm sm:text-base">
                        <Navigation className="h-4 w-4 mr-2" />
                        Field Operations
                      </h4>
                      <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
                        {farmingAdvice.fieldWork}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* 7-Day Forecast - Mobile Optimized */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>7-Day Forecast</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 sm:space-y-3">
                {forecast.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white w-12 sm:w-16 flex-shrink-0">
                        {index === 0 ? "Tomorrow" : formatDate(day.date).split(" ")[0]}
                      </div>
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {getWeatherIcon(day.icon, "sm")}
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize truncate">
                          {day.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm flex-shrink-0">
                      <div className="hidden sm:flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <Droplets className="h-3 w-3" />
                        <span>{day.humidity}%</span>
                      </div>
                      <div className="hidden sm:flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <Wind className="h-3 w-3" />
                        <span>{day.windSpeed} km/h</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                          {day.temperature.max}°/{day.temperature.min}°
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Weather Details - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Weather Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Visibility</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {currentWeather.visibility} km
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">UV Index</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{currentWeather.uvIndex}</span>
                </div>
                {currentWeather.sunrise && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Sunrise className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sunrise</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{currentWeather.sunrise}</span>
                  </div>
                )}
                {currentWeather.sunset && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Sunset className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sunset</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{currentWeather.sunset}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Location Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Coordinates</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {selectedLocation?.latitude.toFixed(2)}, {selectedLocation?.longitude.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {selectedLocation?.lastUpdated &&
                      new Date(selectedLocation.lastUpdated).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Live
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
