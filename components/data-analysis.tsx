"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Droplets,
  Sun,
  DollarSign,
  AlertTriangle,
  Settings,
  Plus,
  X,
  PieChart,
  Zap,
  MapPin,
  Sprout,
  Tractor,
  Shield,
  Gauge,
} from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Area,
  AreaChart,
} from "recharts"

interface FarmData {
  farmName: string
  location: string
  totalArea: number
  activeFields: number
  cropTypes: string[]
  soilType: string
  climateZone: string
  irrigationType: string
  farmingExperience: string
  primaryCrops: string
  notes: string
  farmType: string
  organicCertified: boolean
  laborers: number
  machinery: string[]
  challenges: string[]
  isSetup: boolean
  cropsGrowing: number
  soilMoisture: number
  healthScore: number
  harvestReady: number
  irrigationStatus: string
  lastUpdated: string
  weatherCondition: string
  nextHarvest: string
  totalYield: string
  efficiency: number
}

interface AnalyticsData {
  yieldTrends: Array<{ month: string; yieldValue: number; target: number }>
  cropPerformance: Array<{ crop: string; performance: number; area: number }>
  soilHealth: Array<{ parameter: string; value: number; optimal: number }>
  weatherImpact: Array<{ month: string; rainfall: number; temperature: number; yieldValue: number }>
  costAnalysis: Array<{ category: string; cost: number; budget: number }>
  efficiency: Array<{ metric: string; current: number; target: number }>
}

interface DataAnalysisProps {
  onNotification?: (notification: any) => void
}

export function DataAnalysis({ onNotification }: DataAnalysisProps) {
  const [farmData, setFarmData] = useState<FarmData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [setupData, setSetupData] = useState<Partial<FarmData>>({
    cropTypes: [],
    machinery: [],
    challenges: [],
  })
  const [activeTab, setActiveTab] = useState("overview")

  // Load farm data from localStorage
  const loadFarmData = useCallback(() => {
    try {
      const savedData = localStorage.getItem("croplink-farm-data")
      if (savedData) {
        const data = JSON.parse(savedData)
        console.log("📊 Loading farm data for analytics:", data)
        setFarmData(data)
        return data
      }
      return null
    } catch (error) {
      console.error("❌ Failed to load farm data:", error)
      return null
    }
  }, [])

  // Save farm data to localStorage
  const saveFarmData = useCallback((data: FarmData) => {
    try {
      localStorage.setItem("croplink-farm-data", JSON.stringify(data))
      console.log("💾 Farm data saved for analytics")

      // Trigger storage event for other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "croplink-farm-data",
          newValue: JSON.stringify(data),
          storageArea: localStorage,
        }),
      )
    } catch (error) {
      console.error("❌ Failed to save farm data:", error)
    }
  }, [])

  // Generate realistic analytics data based on farm setup
  const generateAnalyticsData = useCallback((farm: FarmData): AnalyticsData => {
    console.log("🔄 Generating analytics data for:", farm.farmName)

    // Base multipliers based on farm characteristics
    const areaMultiplier = Math.log(farm.totalArea + 1) / 3
    const experienceMultiplier =
      farm.farmingExperience === "beginner" ? 0.7 : farm.farmingExperience === "intermediate" ? 0.85 : 1.0
    const organicMultiplier = farm.organicCertified ? 0.9 : 1.0
    const soilMultiplier =
      farm.soilType === "loamy" ? 1.1 : farm.soilType === "clay" ? 0.9 : farm.soilType === "sandy" ? 0.8 : 1.0

    // Generate yield trends (last 12 months)
    const yieldTrends = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
      })
      const baseYield = 2.5 * areaMultiplier * experienceMultiplier * organicMultiplier * soilMultiplier
      const seasonalVariation = Math.sin((i / 12) * 2 * Math.PI) * 0.3 + 1
      const randomVariation = 0.8 + Math.random() * 0.4
      const calculatedYield = Math.round(baseYield * seasonalVariation * randomVariation * 10) / 10
      const target = Math.round(baseYield * seasonalVariation * 1.1 * 10) / 10

      return { month, yieldValue: calculatedYield, target }
    })

    // Generate crop performance data - ensure we have valid crop types
    const validCropTypes = farm.cropTypes && farm.cropTypes.length > 0 ? farm.cropTypes : ["Rice", "Wheat", "Corn"]
    const cropPerformance = validCropTypes.map((crop) => {
      const basePerformance = 70 + Math.random() * 25
      const cropSpecificMultiplier = crop.toLowerCase().includes("rice")
        ? 1.1
        : crop.toLowerCase().includes("wheat")
          ? 1.05
          : 1.0
      const performance = Math.round(basePerformance * cropSpecificMultiplier * experienceMultiplier)
      const area = Math.round((farm.totalArea / validCropTypes.length) * (0.8 + Math.random() * 0.4))

      return { crop, performance, area }
    })

    // Generate soil health data
    const soilHealth = [
      { parameter: "pH Level", value: 6.2 + Math.random() * 1.6, optimal: 6.5 },
      { parameter: "Nitrogen", value: 45 + Math.random() * 30, optimal: 60 },
      { parameter: "Phosphorus", value: 25 + Math.random() * 20, optimal: 35 },
      { parameter: "Potassium", value: 180 + Math.random() * 40, optimal: 200 },
      { parameter: "Organic Matter", value: 2.5 + Math.random() * 1.5, optimal: 3.5 },
      { parameter: "Moisture", value: farm.soilMoisture || 65 + Math.random() * 20, optimal: 75 },
    ]

    // Generate weather impact data
    const weatherImpact = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
      })
      const rainfall = 50 + Math.random() * 100 + Math.sin((i / 12) * 2 * Math.PI) * 30
      const temperature = 25 + Math.sin((i / 12) * 2 * Math.PI) * 8 + Math.random() * 5
      const yieldCorrelation = (rainfall / 100) * 0.3 + (1 - Math.abs(temperature - 28) / 15) * 0.7
      const yieldValue = Math.round(yieldCorrelation * 4 * areaMultiplier * 10) / 10
      return {
        month,
        rainfall: Math.round(rainfall),
        temperature: Math.round(temperature * 10) / 10,
        yieldValue,
      }
    })

    // Generate cost analysis
    const costAnalysis = [
      { category: "Seeds", cost: farm.totalArea * 150 * (1 + Math.random() * 0.3), budget: farm.totalArea * 180 },
      { category: "Fertilizers", cost: farm.totalArea * 200 * (1 + Math.random() * 0.4), budget: farm.totalArea * 250 },
      { category: "Pesticides", cost: farm.totalArea * 100 * (1 + Math.random() * 0.5), budget: farm.totalArea * 140 },
      { category: "Labor", cost: farm.laborers * 15000 * (1 + Math.random() * 0.2), budget: farm.laborers * 18000 },
      {
        category: "Machinery",
        cost: (farm.machinery?.length || 0) * 5000 * (1 + Math.random() * 0.3),
        budget: (farm.machinery?.length || 0) * 6000,
      },
      { category: "Irrigation", cost: farm.totalArea * 80 * (1 + Math.random() * 0.4), budget: farm.totalArea * 100 },
    ].map((item) => ({
      ...item,
      cost: Math.round(item.cost),
      budget: Math.round(item.budget),
    }))

    // Generate efficiency metrics
    const efficiency = [
      { metric: "Water Usage", current: 75 + Math.random() * 20, target: 90 },
      { metric: "Crop Yield", current: farm.healthScore || 80 + Math.random() * 15, target: 95 },
      { metric: "Cost Efficiency", current: 70 + Math.random() * 20, target: 85 },
      { metric: "Labor Productivity", current: 65 + Math.random() * 25, target: 80 },
      { metric: "Soil Health", current: 78 + Math.random() * 17, target: 90 },
      { metric: "Pest Management", current: 82 + Math.random() * 13, target: 95 },
    ].map((item) => ({
      ...item,
      current: Math.round(item.current),
    }))

    return {
      yieldTrends,
      cropPerformance,
      soilHealth,
      weatherImpact,
      costAnalysis,
      efficiency,
    }
  }, [])

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      setLoading(true)
      const data = loadFarmData()

      if (data && data.isSetup) {
        console.log("✅ Farm data found, generating analytics")
        setFarmData(data)
        const analytics = generateAnalyticsData(data)
        setAnalyticsData(analytics)
        setShowSetup(false)
      } else {
        console.log("ℹ️ No farm setup found, showing setup wizard")
        setShowSetup(true)
      }

      setLoading(false)
    }

    initializeData()
  }, [loadFarmData, generateAnalyticsData])

  // Setup form handlers
  const handleSetupChange = (field: string, value: any) => {
    setSetupData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, value: string) => {
    if (!value.trim()) return
    setSetupData((prev) => ({
      ...prev,
      [field]: [...((prev[field] as string[]) || []), value.trim()],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setSetupData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[])?.filter((_, i) => i !== index) || [],
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeFarmSetup = () => {
    // Calculate intelligent metrics based on setup data
    const calculateMetrics = (data: Partial<FarmData>) => {
      const baseHealth = 75
      const experienceBonus =
        data.farmingExperience === "expert" ? 15 : data.farmingExperience === "intermediate" ? 10 : 5
      const organicBonus = data.organicCertified ? 5 : 0
      const soilBonus = data.soilType === "loamy" ? 10 : data.soilType === "clay" ? 5 : 0
      const irrigationBonus = data.irrigationType === "drip" ? 8 : data.irrigationType === "sprinkler" ? 5 : 2

      const healthScore = Math.min(100, baseHealth + experienceBonus + organicBonus + soilBonus + irrigationBonus)
      const efficiency = Math.min(100, healthScore - 5 + Math.random() * 10)
      const soilMoisture = 60 + Math.random() * 30

      return {
        healthScore: Math.round(healthScore),
        efficiency: Math.round(efficiency),
        soilMoisture: Math.round(soilMoisture),
        cropsGrowing: data.cropTypes?.length || 0,
        activeFields: Math.ceil((data.totalArea || 0) / 5),
        harvestReady: Math.floor(Math.random() * 3),
        irrigationStatus: data.irrigationType ? "Active" : "Manual",
        weatherCondition: "Favorable",
        nextHarvest: "2-3 weeks",
        totalYield: `${Math.round((data.totalArea || 0) * 2.5)} tons`,
      }
    }

    const metrics = calculateMetrics(setupData)

    const completeFarmData: FarmData = {
      farmName: setupData.farmName || "My Farm",
      location: setupData.location || "",
      totalArea: setupData.totalArea || 0,
      activeFields: metrics.activeFields,
      cropTypes: setupData.cropTypes || [],
      soilType: setupData.soilType || "",
      climateZone: setupData.climateZone || "",
      irrigationType: setupData.irrigationType || "",
      farmingExperience: setupData.farmingExperience || "",
      primaryCrops: setupData.primaryCrops || "",
      notes: setupData.notes || "",
      farmType: setupData.farmType || "",
      organicCertified: setupData.organicCertified || false,
      laborers: setupData.laborers || 0,
      machinery: setupData.machinery || [],
      challenges: setupData.challenges || [],
      isSetup: true,
      cropsGrowing: metrics.cropsGrowing,
      soilMoisture: metrics.soilMoisture,
      healthScore: metrics.healthScore,
      harvestReady: metrics.harvestReady,
      irrigationStatus: metrics.irrigationStatus,
      lastUpdated: new Date().toISOString(),
      weatherCondition: metrics.weatherCondition,
      nextHarvest: metrics.nextHarvest,
      totalYield: metrics.totalYield,
      efficiency: metrics.efficiency,
    }

    console.log("🎉 Completing farm setup with data:", completeFarmData)

    setFarmData(completeFarmData)
    saveFarmData(completeFarmData)

    const analytics = generateAnalyticsData(completeFarmData)
    setAnalyticsData(analytics)

    setShowSetup(false)
    setCurrentStep(1)
    setSetupData({ cropTypes: [], machinery: [], challenges: [] })

    onNotification?.({
      title: "Farm Analytics Ready!",
      message: `${completeFarmData.farmName} setup complete. Analytics dashboard is now available.`,
      type: "success",
    })
  }

  const renderSetupStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Basic Farm Information
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Let's start with the basics about your farm
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="farmName" className="text-sm sm:text-base">
                  Farm Name *
                </Label>
                <Input
                  id="farmName"
                  placeholder="Enter your farm name"
                  value={setupData.farmName || ""}
                  onChange={(e) => handleSetupChange("farmName", e.target.value)}
                  className="mt-1 text-base"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-sm sm:text-base">
                  Location *
                </Label>
                <Input
                  id="location"
                  placeholder="City, State/Province, Country"
                  value={setupData.location || ""}
                  onChange={(e) => handleSetupChange("location", e.target.value)}
                  className="mt-1 text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="totalArea" className="text-sm sm:text-base">
                    Total Area (acres) *
                  </Label>
                  <Input
                    id="totalArea"
                    type="number"
                    placeholder="0"
                    value={setupData.totalArea || ""}
                    onChange={(e) => handleSetupChange("totalArea", Number.parseFloat(e.target.value) || 0)}
                    className="mt-1 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="farmType" className="text-sm sm:text-base">
                    Farm Type *
                  </Label>
                  <Select
                    value={setupData.farmType || ""}
                    onValueChange={(value) => handleSetupChange("farmType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select farm type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop">Crop Farming</SelectItem>
                      <SelectItem value="livestock">Livestock</SelectItem>
                      <SelectItem value="mixed">Mixed Farming</SelectItem>
                      <SelectItem value="organic">Organic Farming</SelectItem>
                      <SelectItem value="dairy">Dairy Farming</SelectItem>
                      <SelectItem value="poultry">Poultry Farming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="farmingExperience" className="text-sm sm:text-base">
                  Farming Experience *
                </Label>
                <Select
                  value={setupData.farmingExperience || ""}
                  onValueChange={(value) => handleSetupChange("farmingExperience", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (3-10 years)</SelectItem>
                    <SelectItem value="expert">Expert (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Environmental Details
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Tell us about your farm's environment
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="soilType" className="text-sm sm:text-base">
                    Soil Type *
                  </Label>
                  <Select
                    value={setupData.soilType || ""}
                    onValueChange={(value) => handleSetupChange("soilType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="loamy">Loamy</SelectItem>
                      <SelectItem value="silt">Silt</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="climateZone" className="text-sm sm:text-base">
                    Climate Zone *
                  </Label>
                  <Select
                    value={setupData.climateZone || ""}
                    onValueChange={(value) => handleSetupChange("climateZone", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select climate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tropical">Tropical</SelectItem>
                      <SelectItem value="subtropical">Subtropical</SelectItem>
                      <SelectItem value="temperate">Temperate</SelectItem>
                      <SelectItem value="arid">Arid</SelectItem>
                      <SelectItem value="semi-arid">Semi-Arid</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="irrigationType" className="text-sm sm:text-base">
                  Irrigation System *
                </Label>
                <Select
                  value={setupData.irrigationType || ""}
                  onValueChange={(value) => handleSetupChange("irrigationType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select irrigation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drip">Drip Irrigation</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                    <SelectItem value="flood">Flood Irrigation</SelectItem>
                    <SelectItem value="manual">Manual Watering</SelectItem>
                    <SelectItem value="rainfed">Rain-fed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="organicCertified"
                  checked={setupData.organicCertified || false}
                  onCheckedChange={(checked) => handleSetupChange("organicCertified", checked)}
                />
                <Label htmlFor="organicCertified" className="text-sm">
                  Organic Certified Farm
                </Label>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Crop Information</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">What crops do you grow?</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="primaryCrops" className="text-sm sm:text-base">
                  Primary Crops *
                </Label>
                <Input
                  id="primaryCrops"
                  placeholder="e.g., Rice, Wheat, Corn"
                  value={setupData.primaryCrops || ""}
                  onChange={(e) => handleSetupChange("primaryCrops", e.target.value)}
                  className="mt-1 text-base"
                />
              </div>

              <div>
                <Label className="text-sm sm:text-base">Crop Types</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a crop type"
                      className="text-base"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleArrayChange("cropTypes", e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 bg-transparent"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        if (input.value.trim()) {
                          handleArrayChange("cropTypes", input.value)
                          input.value = ""
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(setupData.cropTypes || []).map((crop, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1 text-sm">
                        <span>{crop}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeArrayItem("cropTypes", index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Additional Details
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Final details about your farm operations
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="laborers" className="text-sm sm:text-base">
                    Number of Laborers
                  </Label>
                  <Input
                    id="laborers"
                    type="number"
                    placeholder="0"
                    value={setupData.laborers || ""}
                    onChange={(e) => handleSetupChange("laborers", Number.parseInt(e.target.value) || 0)}
                    className="mt-1 text-base"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm sm:text-base">Farm Machinery</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add machinery (e.g., Tractor, Harvester)"
                      className="text-base"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleArrayChange("machinery", e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 bg-transparent"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        if (input.value.trim()) {
                          handleArrayChange("machinery", input.value)
                          input.value = ""
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(setupData.machinery || []).map((machine, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1 text-sm">
                        <span>{machine}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeArrayItem("machinery", index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm sm:text-base">Main Challenges</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a challenge (e.g., Pest control, Water shortage)"
                      className="text-base"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleArrayChange("challenges", e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 bg-transparent"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        if (input.value.trim()) {
                          handleArrayChange("challenges", input.value)
                          input.value = ""
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(setupData.challenges || []).map((challenge, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1 text-sm">
                        <span>{challenge}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeArrayItem("challenges", index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm sm:text-base">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about your farm..."
                  value={setupData.notes || ""}
                  onChange={(e) => handleSetupChange("notes", e.target.value)}
                  className="mt-1 text-base"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4">
        <div className="text-center">
          <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse text-purple-500 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading farm analytics...</p>
        </div>
      </div>
    )
  }

  if (showSetup) {
    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Settings className="h-5 w-5 text-purple-600" />
              <span>Farm Analytics Setup</span>
            </CardTitle>
            <div className="flex items-center space-x-2 mt-3 sm:mt-4">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Step {currentStep} of 4</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {renderSetupStep()}

            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-6 sm:mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="w-full sm:w-auto bg-transparent"
              >
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!setupData.farmName || !setupData.location || !setupData.totalArea)) ||
                    (currentStep === 2 && (!setupData.soilType || !setupData.climateZone || !setupData.irrigationType))
                  }
                  className="bg-purple-500 hover:bg-purple-600 w-full sm:w-auto"
                >
                  Next
                </Button>
              ) : (
                <Button onClick={completeFarmSetup} className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
                  Complete Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!farmData || !analyticsData) {
    return (
      <div className="text-center py-8 sm:py-12 px-3 sm:px-4">
        <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-3 sm:mb-4" />
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">No farm data available</p>
        <Button onClick={() => setShowSetup(true)} className="bg-purple-500 hover:bg-purple-600">
          Setup Farm Analytics
        </Button>
      </div>
    )
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff"]

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-4">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Farm Analytics</h2>
          <Badge variant="outline" className="text-xs">
            {farmData.farmName}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSetup(true)}
          className="bg-white dark:bg-gray-800 w-full sm:w-auto"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Analytics Tabs - Mobile Optimized */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="text-xs p-2 flex flex-col items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="yield" className="text-xs p-2 flex flex-col items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span className="hidden sm:inline">Yield</span>
            <span className="sm:hidden">Yield</span>
          </TabsTrigger>
          <TabsTrigger value="crops" className="text-xs p-2 flex flex-col items-center gap-1">
            <Sprout className="h-3 w-3" />
            <span className="hidden sm:inline">Crops</span>
            <span className="sm:hidden">Crops</span>
          </TabsTrigger>
          <TabsTrigger value="soil" className="text-xs p-2 flex flex-col items-center gap-1">
            <Shield className="h-3 w-3" />
            <span className="hidden sm:inline">Soil</span>
            <span className="sm:hidden">Soil</span>
          </TabsTrigger>
          <TabsTrigger value="costs" className="text-xs p-2 flex flex-col items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span className="hidden sm:inline">Costs</span>
            <span className="sm:hidden">Costs</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Mobile Optimized */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs sm:text-sm">Farm Health</p>
                    <p className="text-xl sm:text-2xl font-bold">{farmData.healthScore}%</p>
                  </div>
                  <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm">Efficiency</p>
                    <p className="text-xl sm:text-2xl font-bold">{farmData.efficiency}%</p>
                  </div>
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs sm:text-sm">Total Yield</p>
                    <p className="text-xl sm:text-2xl font-bold">{farmData.totalYield.split(" ")[0]}</p>
                    <p className="text-purple-200 text-xs">tons</p>
                  </div>
                  <Tractor className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-xs sm:text-sm">Active Fields</p>
                    <p className="text-xl sm:text-2xl font-bold">{farmData.activeFields}</p>
                  </div>
                  <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Efficiency Metrics - Mobile Optimized */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Gauge className="h-5 w-5 text-purple-600" />
                <span>Efficiency Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                {analyticsData.efficiency.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{metric.metric}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {metric.current}% / {metric.target}%
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            metric.current >= metric.target
                              ? "bg-green-500"
                              : metric.current >= metric.target * 0.8
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${(metric.current / metric.target) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-12 sm:w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats - Mobile Optimized */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Farm Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 pt-0">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm truncate ml-2">
                    {farmData.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Area</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{farmData.totalArea} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Soil Type</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm capitalize">
                    {farmData.soilType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Irrigation</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm capitalize">
                    {farmData.irrigationType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Experience</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm capitalize">
                    {farmData.farmingExperience}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 pt-0">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Crops Growing</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{farmData.cropsGrowing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Soil Moisture</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {Math.round(farmData.soilMoisture)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ready to Harvest</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {farmData.harvestReady} fields
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Next Harvest</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{farmData.nextHarvest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {new Date(farmData.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Yield Trends Tab - Mobile Optimized */}
        <TabsContent value="yield" className="space-y-4 sm:space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Yield Trends (Last 12 Months)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={analyticsData.yieldTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="yieldValue" stroke="#10b981" strokeWidth={2} name="Actual Yield" />
                    <Line type="monotone" dataKey="target" stroke="#6b7280" strokeDasharray="5 5" name="Target Yield" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Sun className="h-5 w-5 text-orange-600" />
                <span>Weather Impact on Yield</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.weatherImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="yieldValue"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Yield"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crop Performance Tab - Mobile Optimized */}
        <TabsContent value="crops" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Sprout className="h-5 w-5 text-green-600" />
                  <span>Crop Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={analyticsData.cropPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="performance" fill="#10b981" name="Performance %" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  <span>Crop Area Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.cropPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ crop, area }) => `${crop}: ${area}ac`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="area"
                      >
                        {analyticsData.cropPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Soil Health Tab - Mobile Optimized */}
        <TabsContent value="soil" className="space-y-4 sm:space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Shield className="h-5 w-5 text-brown-600" />
                <span>Soil Health Parameters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                {analyticsData.soilHealth.map((param, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{param.parameter}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {param.value.toFixed(1)} / {param.optimal}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            param.value >= param.optimal
                              ? "bg-green-500"
                              : param.value >= param.optimal * 0.8
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min((param.value / param.optimal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="w-12 sm:w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Droplets className="h-5 w-5 text-blue-600" />
                <span>Soil Health Chart</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={analyticsData.soilHealth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="parameter" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" name="Current Value" />
                    <Bar dataKey="optimal" fill="#10b981" name="Optimal Value" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Analysis Tab - Mobile Optimized */}
        <TabsContent value="costs" className="space-y-4 sm:space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Cost Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={analyticsData.costAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#ef4444" name="Actual Cost" />
                    <Bar dataKey="budget" fill="#10b981" name="Budget" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {analyticsData.costAnalysis.map((item, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{item.category}</h4>
                    <Badge variant={item.cost <= item.budget ? "default" : "destructive"} className="text-xs">
                      {item.cost <= item.budget ? "On Budget" : "Over Budget"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Actual</span>
                      <span className="font-medium text-gray-900 dark:text-white">₹{item.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Budget</span>
                      <span className="font-medium text-gray-900 dark:text-white">₹{item.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.cost <= item.budget ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min((item.cost / item.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
