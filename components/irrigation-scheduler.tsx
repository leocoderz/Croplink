"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Droplets,
  Calendar,
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  CloudRain,
  Sun,
  Thermometer,
  Wind,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Save,
} from "lucide-react"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  description: string
  precipitation?: number
}

interface ForecastData {
  date: string
  temperature: { min: number; max: number }
  description: string
  precipitation?: number
  humidity: number
}

interface IrrigationZone {
  id: string
  name: string
  cropType: string
  area: number // in acres
  soilType: string
  currentMoisture: number // percentage
  targetMoisture: number // percentage
  irrigationType: "drip" | "sprinkler" | "flood" | "manual"
  flowRate: number // liters per minute
  isActive: boolean
  lastWatered: string
  nextScheduled?: string
  duration: number // minutes
  priority: "high" | "medium" | "low"
}

interface IrrigationSchedule {
  id: string
  zoneId: string
  zoneName: string
  scheduledTime: string
  duration: number
  status: "pending" | "active" | "completed" | "cancelled"
  reason: string
  waterAmount: number // liters
  createdBy: "auto" | "manual"
}

interface IrrigationSettings {
  autoScheduling: boolean
  weatherIntegration: boolean
  moistureThreshold: number
  rainDelay: number // hours
  maxDailyWatering: number // minutes per zone
  earlyMorningStart: string // time
  eveningEnd: string // time
  notifications: boolean
}

interface IrrigationSchedulerProps {
  onNotification?: (notification: any) => void
}

export function IrrigationScheduler({ onNotification }: IrrigationSchedulerProps) {
  const [zones, setZones] = useState<IrrigationZone[]>([])
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>([])
  const [settings, setSettings] = useState<IrrigationSettings>({
    autoScheduling: true,
    weatherIntegration: true,
    moistureThreshold: 40,
    rainDelay: 24,
    maxDailyWatering: 60,
    earlyMorningStart: "06:00",
    eveningEnd: "20:00",
    notifications: true,
  })
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(true)
  const [showZoneDialog, setShowZoneDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [editingZone, setEditingZone] = useState<IrrigationZone | null>(null)
  const [newZone, setNewZone] = useState<Partial<IrrigationZone>>({
    name: "",
    cropType: "",
    area: 1,
    soilType: "loamy",
    targetMoisture: 60,
    irrigationType: "drip",
    flowRate: 100,
    duration: 30,
    priority: "medium",
  })

  // Load saved data
  const loadSavedData = useCallback(() => {
    try {
      const savedZones = localStorage.getItem("croplink-irrigation-zones")
      const savedSchedules = localStorage.getItem("croplink-irrigation-schedules")
      const savedSettings = localStorage.getItem("croplink-irrigation-settings")

      if (savedZones) {
        const zones = JSON.parse(savedZones)
        setZones(zones)
        console.log("💧 Loaded irrigation zones:", zones.length)
      }

      if (savedSchedules) {
        const schedules = JSON.parse(savedSchedules)
        setSchedules(schedules)
        console.log("📅 Loaded irrigation schedules:", schedules.length)
      }

      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setSettings(settings)
        console.log("⚙️ Loaded irrigation settings")
      }
    } catch (error) {
      console.error("❌ Error loading irrigation data:", error)
    }
  }, [])

  // Save data
  const saveData = useCallback(() => {
    try {
      localStorage.setItem("croplink-irrigation-zones", JSON.stringify(zones))
      localStorage.setItem("croplink-irrigation-schedules", JSON.stringify(schedules))
      localStorage.setItem("croplink-irrigation-settings", JSON.stringify(settings))
      console.log("💾 Saved irrigation data")
    } catch (error) {
      console.error("❌ Error saving irrigation data:", error)
    }
  }, [zones, schedules, settings])

  // Fetch weather data
  const fetchWeatherData = useCallback(async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"))
          return
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 600000,
        })
      })

      const { latitude, longitude } = position.coords

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`/api/weather/current?lat=${latitude}&lon=${longitude}`),
        fetch(`/api/weather/forecast?lat=${latitude}&lon=${longitude}`),
      ])

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json()
        if (weatherData && !weatherData.error) {
          setWeather(weatherData)
          console.log("🌤️ Weather data loaded for irrigation")
        }
      }

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json()
        if (Array.isArray(forecastData) && forecastData.length > 0) {
          setForecast(forecastData.slice(0, 3)) // Next 3 days
          console.log("📅 Forecast data loaded for irrigation")
        }
      }
    } catch (error) {
      console.warn("⚠️ Could not fetch weather data for irrigation:", error)
    }
  }, [])

  // Calculate irrigation needs based on weather and soil moisture
  const calculateIrrigationNeeds = useCallback(
    (
      zone: IrrigationZone,
    ): { needed: boolean; urgency: "low" | "medium" | "high"; reason: string; duration: number } => {
      let needed = false
      let urgency: "low" | "medium" | "high" = "low"
      let reason = ""
      let duration = zone.duration

      // Check soil moisture
      if (zone.currentMoisture < settings.moistureThreshold) {
        needed = true
        const moistureDeficit = settings.moistureThreshold - zone.currentMoisture
        if (moistureDeficit > 30) {
          urgency = "high"
          reason = `Critical soil moisture (${zone.currentMoisture}%)`
          duration = Math.min(zone.duration * 1.5, settings.maxDailyWatering)
        } else if (moistureDeficit > 15) {
          urgency = "medium"
          reason = `Low soil moisture (${zone.currentMoisture}%)`
          duration = zone.duration
        } else {
          urgency = "low"
          reason = `Soil moisture below target (${zone.currentMoisture}%)`
          duration = Math.max(zone.duration * 0.7, 15)
        }
      }

      // Weather considerations
      if (weather && settings.weatherIntegration) {
        // High temperature increases water needs
        if (weather.temperature > 35) {
          if (!needed) {
            needed = true
            reason = `High temperature (${weather.temperature}°C)`
            urgency = "medium"
          } else {
            duration = Math.min(duration * 1.2, settings.maxDailyWatering)
            reason += ` + high temperature`
          }
        }

        // Low humidity increases evaporation
        if (weather.humidity < 30) {
          if (!needed) {
            needed = true
            reason = `Low humidity (${weather.humidity}%)`
            urgency = "low"
          } else {
            duration = Math.min(duration * 1.1, settings.maxDailyWatering)
            reason += ` + low humidity`
          }
        }

        // Strong wind increases evaporation
        if (weather.windSpeed > 20) {
          if (needed) {
            duration = Math.min(duration * 1.1, settings.maxDailyWatering)
            reason += ` + strong wind`
          }
        }

        // Recent or upcoming rain
        const upcomingRain = forecast.some((day) => (day.precipitation || 0) > 30)
        if (upcomingRain && urgency !== "high") {
          if (needed) {
            duration = Math.max(duration * 0.7, 10)
            reason += ` (rain expected)`
          } else {
            reason = "Rain expected - irrigation not needed"
            needed = false
          }
        }
      }

      // Crop-specific adjustments
      const cropWaterNeeds = {
        rice: 1.3,
        wheat: 1.0,
        corn: 1.2,
        tomato: 1.4,
        potato: 1.1,
        cotton: 1.2,
        sugarcane: 1.5,
      }

      const cropMultiplier = cropWaterNeeds[zone.cropType.toLowerCase() as keyof typeof cropWaterNeeds] || 1.0
      duration = Math.round(duration * cropMultiplier)

      // Soil type adjustments
      const soilRetention = {
        sandy: 0.8, // drains quickly
        clay: 1.2, // retains water
        loamy: 1.0, // balanced
        silt: 1.1,
        red: 0.9,
        black: 1.1,
        alluvial: 1.0,
      }

      const soilMultiplier = soilRetention[zone.soilType as keyof typeof soilRetention] || 1.0
      duration = Math.round(duration * soilMultiplier)

      // Irrigation type efficiency
      const irrigationEfficiency = {
        drip: 1.0, // most efficient
        sprinkler: 1.2,
        flood: 1.5, // least efficient
        manual: 1.3,
      }

      const efficiencyMultiplier = irrigationEfficiency[zone.irrigationType]
      duration = Math.round(duration * efficiencyMultiplier)

      // Ensure duration is within limits
      duration = Math.max(5, Math.min(duration, settings.maxDailyWatering))

      return { needed, urgency, reason: reason || "Routine maintenance", duration }
    },
    [weather, forecast, settings],
  )

  // Generate automatic irrigation schedule
  const generateAutoSchedule = useCallback(() => {
    if (!settings.autoScheduling) return

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const newSchedules: IrrigationSchedule[] = []

    zones.forEach((zone) => {
      if (!zone.isActive) return

      const needs = calculateIrrigationNeeds(zone)
      if (!needs.needed) return

      // Calculate optimal time
      let scheduledTime: Date
      const [earlyHour, earlyMin] = settings.earlyMorningStart.split(":").map(Number)
      const [eveningHour, eveningMin] = settings.eveningEnd.split(":").map(Number)

      if (needs.urgency === "high") {
        // Schedule immediately if critical
        scheduledTime = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes from now
      } else {
        // Schedule for early morning
        scheduledTime = new Date(tomorrow)
        scheduledTime.setHours(earlyHour + Math.random() * 2, earlyMin + Math.random() * 30, 0, 0)
      }

      // Check for conflicts and adjust time
      const existingSchedule = schedules.find(
        (s) =>
          s.zoneId === zone.id &&
          s.status === "pending" &&
          Math.abs(new Date(s.scheduledTime).getTime() - scheduledTime.getTime()) < 60 * 60 * 1000, // within 1 hour
      )

      if (existingSchedule) return // Skip if already scheduled

      const waterAmount = Math.round((zone.flowRate * needs.duration * zone.area) / 10) // rough calculation

      newSchedules.push({
        id: `auto-${Date.now()}-${zone.id}`,
        zoneId: zone.id,
        zoneName: zone.name,
        scheduledTime: scheduledTime.toISOString(),
        duration: needs.duration,
        status: "pending",
        reason: needs.reason,
        waterAmount,
        createdBy: "auto",
      })
    })

    if (newSchedules.length > 0) {
      setSchedules((prev) => [...prev, ...newSchedules])
      console.log(`📅 Generated ${newSchedules.length} automatic irrigation schedules`)

      if (settings.notifications) {
        onNotification?.({
          title: "Irrigation Scheduled",
          message: `${newSchedules.length} zones scheduled for automatic irrigation`,
          type: "success",
        })
      }
    }
  }, [zones, schedules, settings, calculateIrrigationNeeds, onNotification])

  // Simulate moisture updates
  const updateMoistureData = useCallback(() => {
    setZones((prevZones) =>
      prevZones.map((zone) => {
        // Simulate moisture decrease over time
        let newMoisture = zone.currentMoisture

        // Natural evaporation and plant uptake
        const baseDecrease = 2 + Math.random() * 3 // 2-5% per update

        // Weather effects
        if (weather) {
          if (weather.temperature > 30) newMoisture -= 1 // hot weather
          if (weather.humidity < 40) newMoisture -= 1 // dry air
          if (weather.windSpeed > 15) newMoisture -= 0.5 // windy conditions
          if (weather.description.includes("rain")) newMoisture += 10 // rain
        }

        // Soil type effects
        const soilDrainageRate = {
          sandy: 1.5, // drains faster
          clay: 0.7, // retains water
          loamy: 1.0,
          silt: 0.9,
          red: 1.2,
          black: 0.8,
          alluvial: 1.0,
        }

        const drainageMultiplier = soilDrainageRate[zone.soilType as keyof typeof soilDrainageRate] || 1.0
        newMoisture -= baseDecrease * drainageMultiplier

        // Check if zone was recently watered
        const lastWatered = new Date(zone.lastWatered)
        const hoursSinceWatering = (Date.now() - lastWatered.getTime()) / (1000 * 60 * 60)

        if (hoursSinceWatering < 2) {
          // Recently watered, moisture should be higher
          newMoisture = Math.max(newMoisture, zone.targetMoisture + 10)
        }

        // Ensure moisture stays within realistic bounds
        newMoisture = Math.max(10, Math.min(95, newMoisture))

        return {
          ...zone,
          currentMoisture: Math.round(newMoisture),
        }
      }),
    )
  }, [weather])

  // Execute irrigation schedule
  const executeSchedule = useCallback(
    (schedule: IrrigationSchedule) => {
      setSchedules((prev) => prev.map((s) => (s.id === schedule.id ? { ...s, status: "active" as const } : s)))

      // Simulate irrigation execution
      setTimeout(() => {
        setSchedules((prev) => prev.map((s) => (s.id === schedule.id ? { ...s, status: "completed" as const } : s)))

        // Update zone moisture and last watered time
        setZones((prev) =>
          prev.map((zone) => {
            if (zone.id === schedule.zoneId) {
              const moistureIncrease = Math.min(30, zone.targetMoisture - zone.currentMoisture + 10)
              return {
                ...zone,
                currentMoisture: Math.min(95, zone.currentMoisture + moistureIncrease),
                lastWatered: new Date().toISOString(),
              }
            }
            return zone
          }),
        )

        if (settings.notifications) {
          onNotification?.({
            title: "Irrigation Completed",
            message: `${schedule.zoneName} watered for ${schedule.duration} minutes`,
            type: "success",
          })
        }

        console.log(`💧 Completed irrigation for ${schedule.zoneName}`)
      }, 2000) // Simulate 2 second execution
    },
    [settings.notifications, onNotification],
  )

  // Add or update zone
  const saveZone = useCallback(() => {
    if (!newZone.name || !newZone.cropType) {
      onNotification?.({
        title: "Missing Information",
        message: "Please fill in zone name and crop type",
        type: "error",
      })
      return
    }

    const zoneData: IrrigationZone = {
      id: editingZone?.id || `zone-${Date.now()}`,
      name: newZone.name!,
      cropType: newZone.cropType!,
      area: newZone.area || 1,
      soilType: newZone.soilType || "loamy",
      currentMoisture: editingZone?.currentMoisture || 50 + Math.random() * 20,
      targetMoisture: newZone.targetMoisture || 60,
      irrigationType: newZone.irrigationType || "drip",
      flowRate: newZone.flowRate || 100,
      isActive: editingZone?.isActive ?? true,
      lastWatered: editingZone?.lastWatered || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      duration: newZone.duration || 30,
      priority: newZone.priority || "medium",
    }

    if (editingZone) {
      setZones((prev) => prev.map((zone) => (zone.id === editingZone.id ? zoneData : zone)))
      onNotification?.({
        title: "Zone Updated",
        message: `${zoneData.name} has been updated successfully`,
        type: "success",
      })
    } else {
      setZones((prev) => [...prev, zoneData])
      onNotification?.({
        title: "Zone Added",
        message: `${zoneData.name} has been added to irrigation system`,
        type: "success",
      })
    }

    setShowZoneDialog(false)
    setEditingZone(null)
    setNewZone({
      name: "",
      cropType: "",
      area: 1,
      soilType: "loamy",
      targetMoisture: 60,
      irrigationType: "drip",
      flowRate: 100,
      duration: 30,
      priority: "medium",
    })
  }, [newZone, editingZone, onNotification])

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      setLoading(true)
      loadSavedData()
      await fetchWeatherData()
      setLoading(false)
    }
    initialize()
  }, [loadSavedData, fetchWeatherData])

  // Save data when it changes
  useEffect(() => {
    if (!loading) {
      saveData()
    }
  }, [zones, schedules, settings, loading, saveData])

  // Auto-generate schedules
  useEffect(() => {
    if (!loading && zones.length > 0) {
      const interval = setInterval(generateAutoSchedule, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [loading, zones, generateAutoSchedule])

  // Update moisture data periodically
  useEffect(() => {
    if (!loading && zones.length > 0) {
      const interval = setInterval(updateMoistureData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [loading, zones, updateMoistureData])

  // Execute pending schedules
  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date()
      schedules
        .filter((s) => s.status === "pending" && new Date(s.scheduledTime) <= now)
        .forEach((schedule) => {
          executeSchedule(schedule)
        })
    }

    if (!loading) {
      const interval = setInterval(checkSchedules, 10000) // Check every 10 seconds
      return () => clearInterval(interval)
    }
  }, [loading, schedules, executeSchedule])

  const getMoistureColor = (moisture: number, target: number) => {
    if (moisture < target - 20) return "text-red-600"
    if (moisture < target - 10) return "text-yellow-600"
    if (moisture >= target) return "text-green-600"
    return "text-blue-600"
  }

  const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Smart Irrigation Scheduler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Loading irrigation system...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Smart Irrigation Scheduler
              </CardTitle>
              <CardDescription>
                AI-powered irrigation scheduling based on weather forecasts and soil moisture
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.autoScheduling ? "default" : "secondary"}>
                {settings.autoScheduling ? "Auto" : "Manual"}
              </Badge>
              <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Irrigation Settings</DialogTitle>
                    <DialogDescription>Configure your irrigation system preferences</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-scheduling">Automatic Scheduling</Label>
                      <Switch
                        id="auto-scheduling"
                        checked={settings.autoScheduling}
                        onCheckedChange={(checked) => setSettings({ ...settings, autoScheduling: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weather-integration">Weather Integration</Label>
                      <Switch
                        id="weather-integration"
                        checked={settings.weatherIntegration}
                        onCheckedChange={(checked) => setSettings({ ...settings, weatherIntegration: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Notifications</Label>
                      <Switch
                        id="notifications"
                        checked={settings.notifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moisture-threshold">Moisture Threshold (%)</Label>
                      <Input
                        id="moisture-threshold"
                        type="number"
                        min="20"
                        max="80"
                        value={settings.moistureThreshold}
                        onChange={(e) => setSettings({ ...settings, moistureThreshold: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rain-delay">Rain Delay (hours)</Label>
                      <Input
                        id="rain-delay"
                        type="number"
                        min="6"
                        max="72"
                        value={settings.rainDelay}
                        onChange={(e) => setSettings({ ...settings, rainDelay: Number(e.target.value) })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="morning-start">Morning Start</Label>
                        <Input
                          id="morning-start"
                          type="time"
                          value={settings.earlyMorningStart}
                          onChange={(e) => setSettings({ ...settings, earlyMorningStart: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evening-end">Evening End</Label>
                        <Input
                          id="evening-end"
                          type="time"
                          value={settings.eveningEnd}
                          onChange={(e) => setSettings({ ...settings, eveningEnd: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-daily">Max Daily Watering (minutes)</Label>
                      <Input
                        id="max-daily"
                        type="number"
                        min="15"
                        max="180"
                        value={settings.maxDailyWatering}
                        onChange={(e) => setSettings({ ...settings, maxDailyWatering: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="zones" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="zones">Zones</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="zones" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Irrigation Zones</h3>
                <Dialog open={showZoneDialog} onOpenChange={setShowZoneDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Zone
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingZone ? "Edit Zone" : "Add New Zone"}</DialogTitle>
                      <DialogDescription>Configure irrigation zone settings</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zone-name">Zone Name</Label>
                          <Input
                            id="zone-name"
                            placeholder="e.g., North Field"
                            value={newZone.name || ""}
                            onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="crop-type">Crop Type</Label>
                          <Input
                            id="crop-type"
                            placeholder="e.g., Tomato"
                            value={newZone.cropType || ""}
                            onChange={(e) => setNewZone({ ...newZone, cropType: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="area">Area (acres)</Label>
                          <Input
                            id="area"
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={newZone.area || ""}
                            onChange={(e) => setNewZone({ ...newZone, area: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="target-moisture">Target Moisture (%)</Label>
                          <Input
                            id="target-moisture"
                            type="number"
                            min="30"
                            max="90"
                            value={newZone.targetMoisture || ""}
                            onChange={(e) => setNewZone({ ...newZone, targetMoisture: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="soil-type">Soil Type</Label>
                          <Select
                            value={newZone.soilType || ""}
                            onValueChange={(value) => setNewZone({ ...newZone, soilType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select soil type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sandy">Sandy</SelectItem>
                              <SelectItem value="clay">Clay</SelectItem>
                              <SelectItem value="loamy">Loamy</SelectItem>
                              <SelectItem value="silt">Silt</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                              <SelectItem value="black">Black</SelectItem>
                              <SelectItem value="alluvial">Alluvial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="irrigation-type">Irrigation Type</Label>
                          <Select
                            value={newZone.irrigationType || ""}
                            onValueChange={(value: any) => setNewZone({ ...newZone, irrigationType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="drip">Drip Irrigation</SelectItem>
                              <SelectItem value="sprinkler">Sprinkler</SelectItem>
                              <SelectItem value="flood">Flood</SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="flow-rate">Flow Rate (L/min)</Label>
                          <Input
                            id="flow-rate"
                            type="number"
                            min="10"
                            value={newZone.flowRate || ""}
                            onChange={(e) => setNewZone({ ...newZone, flowRate: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Default Duration (min)</Label>
                          <Input
                            id="duration"
                            type="number"
                            min="5"
                            max="120"
                            value={newZone.duration || ""}
                            onChange={(e) => setNewZone({ ...newZone, duration: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newZone.priority || ""}
                          onValueChange={(value: any) => setNewZone({ ...newZone, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowZoneDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveZone}>
                          <Save className="h-4 w-4 mr-2" />
                          {editingZone ? "Update" : "Add"} Zone
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {zones.length === 0 ? (
                <div className="text-center py-12">
                  <Droplets className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-3">No irrigation zones configured</p>
                  <Button onClick={() => setShowZoneDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Zone
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {zones.map((zone) => {
                    const needs = calculateIrrigationNeeds(zone)
                    return (
                      <Card key={zone.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${zone.isActive ? "bg-green-500" : "bg-gray-400"}`}
                            ></div>
                            <div>
                              <h4 className="font-semibold">{zone.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {zone.cropType} • {zone.area} acres • {zone.irrigationType}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={zone.priority === "high" ? "destructive" : "outline"}>
                              {zone.priority}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingZone(zone)
                                setNewZone(zone)
                                setShowZoneDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setZones((prev) => prev.filter((z) => z.id !== zone.id))
                                onNotification?.({
                                  title: "Zone Removed",
                                  message: `${zone.name} has been removed`,
                                  type: "success",
                                })
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Current Moisture</p>
                            <div className="flex items-center gap-2">
                              <p
                                className={`text-lg font-bold ${getMoistureColor(zone.currentMoisture, zone.targetMoisture)}`}
                              >
                                {zone.currentMoisture}%
                              </p>
                              <Progress value={zone.currentMoisture} className="flex-1 h-2" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Target</p>
                            <p className="text-lg font-bold">{zone.targetMoisture}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Last Watered</p>
                            <p className="text-sm font-medium">{new Date(zone.lastWatered).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={zone.isActive ? "default" : "secondary"}>
                              {zone.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>

                        {needs.needed && (
                          <Alert className="mb-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <span className={getUrgencyColor(needs.urgency)}>
                                {needs.urgency.toUpperCase()} PRIORITY:
                              </span>{" "}
                              {needs.reason} - Recommended duration: {needs.duration} minutes
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={zone.isActive}
                              onCheckedChange={(checked) =>
                                setZones((prev) =>
                                  prev.map((z) => (z.id === zone.id ? { ...z, isActive: checked } : z)),
                                )
                              }
                            />
                            <Label>Zone Active</Label>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const schedule: IrrigationSchedule = {
                                id: `manual-${Date.now()}-${zone.id}`,
                                zoneId: zone.id,
                                zoneName: zone.name,
                                scheduledTime: new Date().toISOString(),
                                duration: needs.duration,
                                status: "pending",
                                reason: "Manual activation",
                                waterAmount: Math.round((zone.flowRate * needs.duration * zone.area) / 10),
                                createdBy: "manual",
                              }
                              setSchedules((prev) => [...prev, schedule])
                              executeSchedule(schedule)
                            }}
                            disabled={!zone.isActive}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Water Now
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Irrigation Schedule</h3>
                <Button variant="outline" onClick={generateAutoSchedule} disabled={!settings.autoScheduling}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Generate Schedule
                </Button>
              </div>

              {schedules.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-3">No irrigation schedules</p>
                  <p className="text-sm text-muted-foreground">
                    {settings.autoScheduling
                      ? "Schedules will be generated automatically based on soil moisture and weather"
                      : "Enable automatic scheduling in settings or add zones to create schedules"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedules
                    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                    .map((schedule) => (
                      <Card key={schedule.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                schedule.status === "completed"
                                  ? "bg-green-500"
                                  : schedule.status === "active"
                                    ? "bg-blue-500"
                                    : schedule.status === "cancelled"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                              }`}
                            ></div>
                            <div>
                              <h4 className="font-semibold">{schedule.zoneName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(schedule.scheduledTime).toLocaleString()} • {schedule.duration} minutes
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                schedule.status === "completed"
                                  ? "default"
                                  : schedule.status === "active"
                                    ? "default"
                                    : schedule.status === "cancelled"
                                      ? "destructive"
                                      : "secondary"
                              }
                            >
                              {schedule.status}
                            </Badge>
                            <Badge variant="outline">{schedule.createdBy === "auto" ? "Auto" : "Manual"}</Badge>
                            {schedule.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setSchedules((prev) =>
                                    prev.map((s) =>
                                      s.id === schedule.id ? { ...s, status: "cancelled" as const } : s,
                                    ),
                                  )
                                }
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-muted-foreground">
                          <p>Reason: {schedule.reason}</p>
                          <p>Water Amount: {schedule.waterAmount} liters</p>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <h3 className="text-lg font-semibold">Weather Conditions</h3>

              {weather ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Current Conditions
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="font-medium">{weather.temperature}°C</p>
                          <p className="text-xs text-muted-foreground">Temperature</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{weather.humidity}%</p>
                          <p className="text-xs text-muted-foreground">Humidity</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{weather.windSpeed} km/h</p>
                          <p className="text-xs text-muted-foreground">Wind Speed</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium capitalize">{weather.description}</p>
                          <p className="text-xs text-muted-foreground">Condition</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      3-Day Forecast
                    </h4>
                    <div className="space-y-3">
                      {forecast.map((day, index) => (
                        <div key={day.date} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {index === 0 ? "Today" : new Date(day.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">{day.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {day.temperature.max}° / {day.temperature.min}°
                            </p>
                            {day.precipitation && day.precipitation > 0 && (
                              <p className="text-sm text-blue-600">{day.precipitation}% rain</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Weather data not available</p>
                  <Button variant="outline" className="mt-3 bg-transparent" onClick={fetchWeatherData}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <h3 className="text-lg font-semibold">Irrigation Analytics</h3>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <h4 className="font-semibold">Water Usage</h4>
                  </div>
                  <p className="text-2xl font-bold">
                    {schedules
                      .filter((s) => s.status === "completed")
                      .reduce((total, s) => total + s.waterAmount, 0)
                      .toLocaleString()}{" "}
                    L
                  </p>
                  <p className="text-sm text-muted-foreground">Total water used</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <h4 className="font-semibold">Runtime</h4>
                  </div>
                  <p className="text-2xl font-bold">
                    {schedules.filter((s) => s.status === "completed").reduce((total, s) => total + s.duration, 0)} min
                  </p>
                  <p className="text-sm text-muted-foreground">Total irrigation time</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold">Efficiency</h4>
                  </div>
                  <p className="text-2xl font-bold">
                    {zones.length > 0
                      ? Math.round(zones.reduce((total, zone) => total + zone.currentMoisture, 0) / zones.length)
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-muted-foreground">Average soil moisture</p>
                </Card>
              </div>

              <Card className="p-4">
                <h4 className="font-semibold mb-3">Zone Performance</h4>
                <div className="space-y-3">
                  {zones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">{zone.cropType}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{zone.currentMoisture}%</p>
                          <p className="text-xs text-muted-foreground">Moisture</p>
                        </div>
                        <Progress value={zone.currentMoisture} className="w-20 h-2" />
                        <Badge
                          variant={
                            zone.currentMoisture >= zone.targetMoisture
                              ? "default"
                              : zone.currentMoisture >= zone.targetMoisture - 10
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {zone.currentMoisture >= zone.targetMoisture
                            ? "Optimal"
                            : zone.currentMoisture >= zone.targetMoisture - 10
                              ? "Good"
                              : "Low"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
