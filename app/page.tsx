"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Cloud, Leaf, BarChart3, Building2, Bell, Search, User, X, ChevronRight } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { WeatherWidget } from "@/components/weather-widget"
import { ChatBot } from "@/components/chatbot"
import { DiseasePredictor } from "@/components/disease-predictor"
import { DataAnalysis } from "@/components/data-analysis"
import { GovernmentSchemes } from "@/components/government-schemes"
import { useLanguage } from "@/contexts/language-context"
import { AuthModal } from "@/components/auth-modal"
import { UserProfile } from "@/components/user-profile"
import { FarmSetupModal } from "@/components/farm-setup-modal"

export default function CropLinkApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [notifications, setNotifications] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notificationsList, setNotificationsList] = useState<any[]>([])

  const { t } = useLanguage()

  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAppReady, setIsAppReady] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showSignOutMessage, setShowSignOutMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Real Farm Data State - Load from localStorage and sync with analytics
  const [farmData, setFarmData] = useState({
    cropsGrowing: 0,
    soilMoisture: 0,
    healthScore: 0,
    totalArea: 0,
    activeFields: 0,
    harvestReady: 0,
    irrigationStatus: "Not Set",
    lastUpdated: new Date().toISOString(),
    weatherCondition: "Unknown",
    nextHarvest: "Not scheduled",
    totalYield: "0 tons",
    efficiency: 0,
    isSetup: false,
    farmName: "",
    location: "",
    cropTypes: [],
    soilType: "",
    climateZone: "",
    irrigationType: "",
    farmingExperience: "",
    primaryCrops: "",
    notes: "",
    farmType: "",
    organicCertified: false,
    laborers: 0,
    machinery: [],
    challenges: [],
  })

  // Add state for farm setup
  const [showFarmSetup, setShowFarmSetup] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)

  // Load real farm data from localStorage and sync with analytics data
  const loadFarmData = useCallback(() => {
    try {
      const savedFarmData = localStorage.getItem("croplink-farm-data")
      if (savedFarmData) {
        const data = JSON.parse(savedFarmData)
        console.log("🏠 Loading complete farm data:", data)

        // Ensure all required fields exist with defaults
        const completeData = {
          // Basic farm info
          farmName: data.farmName || "",
          location: data.location || "",
          totalArea: data.totalArea || 0,
          farmType: data.farmType || "",
          soilType: data.soilType || "",
          climateZone: data.climateZone || "",
          irrigationType: data.irrigationType || "",
          farmingExperience: data.farmingExperience || "",
          primaryCrops: data.primaryCrops || "",
          notes: data.notes || "",
          organicCertified: data.organicCertified || false,
          laborers: data.laborers || 0,
          machinery: data.machinery || [],
          challenges: data.challenges || [],
          cropTypes: data.cropTypes || [],

          // Calculated metrics
          cropsGrowing: data.cropsGrowing || data.cropTypes?.length || 0,
          soilMoisture: data.soilMoisture || 0,
          healthScore: data.healthScore || 0,
          activeFields: data.activeFields || 0,
          harvestReady: data.harvestReady || 0,
          irrigationStatus: data.irrigationStatus || "Not Set",
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          weatherCondition: data.weatherCondition || "Unknown",
          nextHarvest: data.nextHarvest || "Not scheduled",
          totalYield: data.totalYield || "0 tons",
          efficiency: data.efficiency || 0,
          isSetup: data.isSetup || false,
        }

        setFarmData(completeData)
        setIsFirstTime(!completeData.isSetup)

        console.log("✅ Complete farm data loaded:", {
          isSetup: completeData.isSetup,
          farmName: completeData.farmName,
          location: completeData.location,
          totalArea: completeData.totalArea,
          cropsGrowing: completeData.cropsGrowing,
          cropTypes: completeData.cropTypes,
          healthScore: completeData.healthScore,
          efficiency: completeData.efficiency,
        })

        return completeData
      } else {
        console.log("ℹ️ No saved farm data found")
        setIsFirstTime(true)
        return null
      }
    } catch (error) {
      console.error("❌ Failed to load farm data:", error)
      setIsFirstTime(true)
      return null
    }
  }, [])

  // Save farm data to localStorage
  const saveFarmData = useCallback((data: any) => {
    try {
      localStorage.setItem("croplink-farm-data", JSON.stringify(data))
      console.log("💾 Farm data saved:", data.farmName)
    } catch (error) {
      console.error("❌ Failed to save farm data:", error)
    }
  }, [])

  // Listen for farm data updates from analytics component
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "croplink-farm-data" && e.newValue) {
        try {
          const updatedData = JSON.parse(e.newValue)
          console.log("🔄 Farm data updated from analytics:", updatedData.farmName)
          setFarmData(updatedData)
          setIsFirstTime(!updatedData.isSetup)
        } catch (error) {
          console.error("❌ Failed to parse updated farm data:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Load real farm data on component mount
  useEffect(() => {
    loadFarmData()
  }, [loadFarmData])

  // Update farm data periodically with realistic variations (only if setup)
  useEffect(() => {
    const updateFarmData = () => {
      if (!farmData.isSetup) return // Don't update if not setup

      setFarmData((prev) => {
        // Only make small realistic changes to calculated metrics
        const updated = {
          ...prev,
          soilMoisture: Math.max(30, Math.min(95, prev.soilMoisture + (Math.random() - 0.5) * 3)),
          healthScore: Math.max(60, Math.min(100, prev.healthScore + (Math.random() - 0.5) * 2)),
          efficiency: Math.max(60, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 1.5)),
          lastUpdated: new Date().toISOString(),
        }

        // Save updated data
        saveFarmData(updated)
        return updated
      })
    }

    // Only update if farm is setup
    if (farmData.isSetup) {
      const interval = setInterval(updateFarmData, 60000) // Update every minute for demo
      return () => clearInterval(interval)
    }
  }, [farmData.isSetup, saveFarmData])

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Get dynamic greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) {
      return "Good Morning"
    } else if (hour < 17) {
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  }

  // Load real notifications from localStorage or API
  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem("croplink-notifications")
      if (savedNotifications) {
        try {
          const notifications = JSON.parse(savedNotifications)
          setNotificationsList(notifications)
          setNotifications(notifications.filter((n: any) => !n.read).length)
        } catch (error) {
          console.error("Failed to load notifications:", error)
          setNotificationsList([])
          setNotifications(0)
        }
      } else {
        // Initialize with empty notifications
        setNotificationsList([])
        setNotifications(0)
      }
    }
    loadNotifications()
  }, [])

  // Add notification function with useCallback to prevent infinite loops
  const addNotification = useCallback((notification: any) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      time: new Date().toISOString(),
      read: false,
    }

    setNotificationsList((prevNotifications) => {
      const updatedNotifications = [newNotification, ...prevNotifications]
      localStorage.setItem("croplink-notifications", JSON.stringify(updatedNotifications))
      return updatedNotifications
    })

    setNotifications((prevCount) => prevCount + 1)
  }, [])

  // Mark notification as read
  const markNotificationRead = useCallback((id: number) => {
    setNotificationsList((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      localStorage.setItem("croplink-notifications", JSON.stringify(updatedNotifications))
      return updatedNotifications
    })

    setNotifications((prevCount) => Math.max(0, prevCount - 1))
  }, [])

  // Initialize app and check authentication
  useEffect(() => {
    const initializeApp = async () => {
      console.log("🚀 Initializing CropLink app...")
      setIsLoading(true)

      try {
        // Small delay for smooth loading animation
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check for saved user data
        const savedUser = localStorage.getItem("croplink-user") || localStorage.getItem("agri-app-user")

        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser)
            console.log("✅ Found saved user:", userData.name)
            setUser(userData)
            setShowAuthModal(false)
          } catch (error) {
            console.error("❌ Failed to parse user data:", error)
            // Clear corrupted data
            localStorage.clear()
            setUser(null)
            setShowAuthModal(true)
          }
        } else {
          console.log("ℹ️ No saved user found")
          setUser(null)
          setShowAuthModal(true)
        }
      } catch (error) {
        console.error("❌ App initialization error:", error)
        setUser(null)
        setShowAuthModal(true)
      } finally {
        setIsLoading(false)
        setIsAppReady(true)
      }
    }

    initializeApp()
  }, [])

  const handleAuthSuccess = useCallback(
    (userData: any) => {
      console.log("🎉 Authentication successful:", userData)

      setUser(userData)
      setShowAuthModal(false)
      setIsAppReady(true)

      // Store in both locations for consistency
      localStorage.setItem("croplink-user", JSON.stringify(userData))
      localStorage.setItem("agri-app-user", JSON.stringify(userData))

      // Add welcome notification
      addNotification({
        title: "Welcome to CropLink!",
        message: `Hello ${userData.name}, welcome to your agricultural companion.`,
        type: "success",
      })
    },
    [addNotification],
  )

  const handleLogout = useCallback(() => {
    console.log("🚪 Starting logout process...")

    // Clear all authentication data immediately
    localStorage.clear()

    // Reset all state
    setUser(null)
    setShowUserProfile(false)
    setActiveTab("home")
    setNotifications(0)
    setNotificationsList([])
    setSearchQuery("")
    setSearchResults([])
    setShowNotifications(false)

    // Show sign out message
    setShowSignOutMessage(true)

    // After 2 seconds, show auth modal
    setTimeout(() => {
      setShowSignOutMessage(false)
      setShowAuthModal(true)
      setIsAppReady(true)
    }, 2000)

    console.log("✅ Logout completed")
  }, [])

  const handleUserClick = useCallback(() => {
    if (user) {
      setShowUserProfile(true)
    } else {
      setShowAuthModal(true)
    }
  }, [user])

  const features = [
    {
      id: "chatbot",
      title: "AI Assistant",
      description: "Get instant farming advice and answers",
      icon: MessageCircle,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      badge: "Smart",
      keywords: ["ai", "assistant", "chat", "help", "questions", "farming"],
    },
    {
      id: "weather",
      title: "Weather Forecast",
      description: "Real-time weather updates and alerts",
      icon: Cloud,
      color: "bg-gradient-to-br from-sky-500 to-sky-600",
      badge: "Live",
      keywords: ["weather", "forecast", "rain", "temperature", "climate"],
    },
    {
      id: "disease",
      title: "Disease Detection",
      description: "Identify crop diseases with AI scanning",
      icon: Leaf,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      badge: "AI Powered",
      keywords: ["disease", "crop", "plant", "health", "diagnosis", "treatment"],
    },
    {
      id: "analysis",
      title: "Farm Analytics",
      description: "Track performance and optimize yields",
      icon: BarChart3,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      badge: "Insights",
      keywords: ["analytics", "data", "insights", "yield", "performance", "metrics"],
    },
    {
      id: "schemes",
      title: "Government Schemes",
      description: "Discover subsidies and benefits",
      icon: Building2,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      badge: "Benefits",
      keywords: ["government", "schemes", "subsidy", "loan", "benefits", "programs"],
    },
  ]

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        const results = features.filter(
          (feature) =>
            feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feature.keywords.some((keyword) => keyword.includes(searchQuery.toLowerCase())),
        )
        setSearchResults(results)
        setIsSearching(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchQuery])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setSearchResults([])
  }, [])

  const formatNotificationTime = useCallback((timeString: string) => {
    const time = new Date(timeString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case "chatbot":
        return (
          <div className="h-[calc(100vh-140px)] overflow-hidden">
            <ChatBot onNotification={addNotification} />
          </div>
        )
      case "weather":
        return (
          <div className="max-h-[calc(100vh-140px)] overflow-y-auto p-4">
            <WeatherWidget onNotification={addNotification} />
          </div>
        )
      case "disease":
        return (
          <div className="max-h-[calc(100vh-140px)] overflow-y-auto p-4">
            <DiseasePredictor onNotification={addNotification} />
          </div>
        )
      case "analysis":
        return (
          <div className="max-h-[calc(100vh-140px)] overflow-y-auto p-4">
            <DataAnalysis onNotification={addNotification} />
          </div>
        )
      case "schemes":
        return (
          <div className="max-h-[calc(100vh-140px)] overflow-y-auto p-4">
            <GovernmentSchemes onNotification={addNotification} />
          </div>
        )
      default:
        return (
          <div className="max-h-[calc(100vh-140px)] overflow-y-auto">
            {/* Header */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getGreeting()}</h1>
                  {user && <p className="text-gray-600 dark:text-gray-300">Welcome back, {user.name}!</p>}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      {notifications > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {notifications}
                        </div>
                      )}
                    </Button>

                    {/* Notifications Panel */}
                    {showNotifications && (
                      <div className="absolute right-0 top-14 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowNotifications(false)}
                              className="rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notificationsList.length > 0 ? (
                            notificationsList.map((notification, index) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                  !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                                }`}
                                onClick={() => markNotificationRead(notification.id)}
                              >
                                <div className="flex items-start space-x-3">
                                  <div
                                    className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? "animate-pulse" : ""} ${
                                      notification.type === "warning"
                                        ? "bg-orange-500"
                                        : notification.type === "success"
                                          ? "bg-green-500"
                                          : notification.type === "reminder"
                                            ? "bg-blue-500"
                                            : "bg-gray-500"
                                    }`}
                                  ></div>
                                  <div className="flex-1 space-y-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                      {formatNotificationTime(notification.time)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center">
                              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                We'll notify you about important updates
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUserClick}
                    className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    {user ? (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    ) : (
                      <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="p-4">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                  {isSearching ? "Searching..." : `${searchResults.length} Results`}
                </div>
                {isSearching ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((feature, index) => {
                      const IconComponent = feature.icon
                      return (
                        <div
                          key={feature.id}
                          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => {
                            setActiveTab(feature.id)
                            clearSearch()
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${feature.color} shadow-lg`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No results found</p>
                  </div>
                )}
              </div>
            )}

            {/* Main Content - Only show when not searching */}
            {!searchQuery && (
              <>
                {/* Weather & Time Cards */}
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Weather Card */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold mb-2">{Math.round(25 + Math.random() * 10)}°C</div>
                          <div className="text-blue-100 font-medium mb-1">
                            {farmData.weatherCondition !== "Unknown"
                              ? farmData.weatherCondition
                              : ["Sunny", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 3)]}
                          </div>
                          <div className="text-blue-200 text-sm">Perfect for farming</div>
                        </div>
                        <div className="text-right">
                          <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm mb-2">
                            <Cloud className="h-8 w-8" />
                          </div>
                          <div className="text-blue-200 text-sm">{currentTime.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Time Card */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold mb-2">
                            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="text-green-100 font-medium mb-1">{getGreeting()}</div>
                          <div className="text-green-200 text-sm">
                            {notifications > 0 ? `${notifications} new updates` : "All caught up!"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm mb-2 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{farmData.activeFields || 0}</span>
                          </div>
                          <div className="text-green-200 text-sm">Active fields</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-4">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Quick Actions
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: "chatbot",
                        icon: MessageCircle,
                        title: "AI Assistant",
                        subtitle: "Ask anything",
                        color: "from-blue-500 to-purple-600",
                      },
                      {
                        id: "disease",
                        icon: Leaf,
                        title: "Crop Health",
                        subtitle: "Scan & detect",
                        color: "from-green-500 to-teal-600",
                      },
                      {
                        id: "analysis",
                        icon: BarChart3,
                        title: "Analytics",
                        subtitle: "View insights",
                        color: "from-purple-500 to-indigo-600",
                      },
                      {
                        id: "schemes",
                        icon: Building2,
                        title: "Schemes",
                        subtitle: "Get benefits",
                        color: "from-orange-500 to-red-600",
                      },
                    ].map((item, index) => (
                      <div
                        key={item.id}
                        className={`bg-gradient-to-br ${item.color} text-white rounded-xl p-4 shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <div className="bg-white/20 p-2 rounded-lg w-fit mb-3 backdrop-blur-sm">
                          <item.icon className="h-6 w-6" />
                        </div>
                        <div className="font-medium mb-1">{item.title}</div>
                        <div className="text-sm opacity-75">{item.subtitle}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Farm Setup Prompt for first-time users */}
                {isFirstTime && !farmData.isSetup && (
                  <div className="p-4">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                          <Leaf className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-1">Welcome to CropLink!</h3>
                          <p className="opacity-90">Set up your farm profile to get personalized insights</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowFarmSetup(true)}
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                      >
                        Set Up My Farm
                      </Button>
                    </div>
                  </div>
                )}

                {/* Farm Status - Using Real Data from Analytics Setup */}
                <div className="p-4">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                    {farmData.isSetup ? `${farmData.farmName} Status` : "Farm Status"}
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {farmData.isSetup ? "Live Farm Data" : "Setup Required"}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            farmData.isSetup
                              ? farmData.healthScore > 85
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : farmData.healthScore > 70
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}
                        >
                          {farmData.isSetup
                            ? farmData.healthScore > 85
                              ? "Excellent"
                              : farmData.healthScore > 70
                                ? "Good"
                                : "Needs Attention"
                            : "Not Setup"}
                        </div>
                        {farmData.isSetup && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(farmData.lastUpdated).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {farmData.isSetup ? (
                      <>
                        {/* Real Farm Data Display */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">{farmData.cropsGrowing}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Crops Growing</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {Math.round(farmData.soilMoisture)}%
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Soil Moisture</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600 mb-1">
                              {Math.round(farmData.healthScore)}%
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Health Score</div>
                          </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Soil Moisture</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {Math.round(farmData.soilMoisture)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  farmData.soilMoisture > 70
                                    ? "bg-blue-500"
                                    : farmData.soilMoisture > 50
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${farmData.soilMoisture}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Health</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {Math.round(farmData.healthScore)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  farmData.healthScore > 85
                                    ? "bg-green-500"
                                    : farmData.healthScore > 70
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${farmData.healthScore}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Farm Efficiency</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {Math.round(farmData.efficiency)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  farmData.efficiency > 85
                                    ? "bg-purple-500"
                                    : farmData.efficiency > 70
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${farmData.efficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Farm Details */}
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Area</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {farmData.totalArea} acres
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Active Fields</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {farmData.activeFields}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {farmData.location || "Not set"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Farm Type</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                  {farmData.farmType || "Not set"}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Ready to Harvest</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {farmData.harvestReady} fields
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Irrigation</span>
                                <span
                                  className={`text-sm font-medium ${
                                    farmData.irrigationStatus === "Active" ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {farmData.irrigationStatus}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Soil Type</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                  {farmData.soilType || "Not set"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Experience</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                  {farmData.farmingExperience || "Not set"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Crop Types Display */}
                        {farmData.cropTypes && farmData.cropTypes.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Current Crops</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {farmData.cropTypes.map((crop, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full"
                                >
                                  {crop}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Additional Farm Info */}
                        {farmData.isSetup && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 gap-3">
                              {farmData.organicCertified && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Certification</span>
                                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
                                    Organic Certified
                                  </span>
                                </div>
                              )}
                              {farmData.laborers > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Laborers</span>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {farmData.laborers}
                                  </span>
                                </div>
                              )}
                              {farmData.machinery && farmData.machinery.length > 0 && (
                                <div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Machinery</span>
                                  <div className="flex flex-wrap gap-1">
                                    {farmData.machinery.map((machine, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full"
                                      >
                                        {machine}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Setup Required Display */
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Complete your farm setup to see live data and analytics
                        </p>
                        <Button
                          onClick={() => setActiveTab("analysis")}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          Setup Farm Profile
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="p-4">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                    All Features
                  </div>
                  <div className="space-y-2">
                    {features.map((feature, index) => {
                      const IconComponent = feature.icon
                      return (
                        <div
                          key={feature.id}
                          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => setActiveTab(feature.id)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${feature.color} shadow-lg`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                  <span className="text-xs text-gray-600 dark:text-gray-400">{feature.badge}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-4 pb-8">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Recent Activity
                  </div>
                  <div className="space-y-2">
                    {notificationsList.slice(0, 3).length > 0 ? (
                      notificationsList.slice(0, 3).map((activity, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                activity.type === "warning"
                                  ? "bg-orange-500"
                                  : activity.type === "success"
                                    ? "bg-green-500"
                                    : activity.type === "reminder"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatNotificationTime(activity.time)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Start using CropLink features to see your activity here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )
    }
  }

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as Element
        if (!target.closest(".relative")) {
          setShowNotifications(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showNotifications])

  // Show loading screen while checking authentication
  if (isLoading || !isAppReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Leaf className="h-12 w-12 text-white" />
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">Loading CropLink...</p>
          <p className="text-gray-500 dark:text-gray-500 mt-3">Your agricultural companion</p>
        </div>
      </div>
    )
  }

  // Show sign out message
  if (showSignOutMessage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <User className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You've Been Signed Out</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Thank you for using CropLink. You have been successfully signed out.
            </p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">Redirecting to sign in...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show auth modal if no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Leaf className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">CropLink</h1>
            <p className="text-gray-600 dark:text-gray-400">Your intelligent agricultural companion</p>
          </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main App Container */}
      <div className="relative min-h-screen">
        {/* Content Area */}
        <div className="pb-24 min-h-screen">{renderContent()}</div>

        {/* Farm Setup Modal */}
        <FarmSetupModal
          isOpen={showFarmSetup}
          onClose={() => setShowFarmSetup(false)}
          onSave={(data) => {
            setFarmData(data)
            saveFarmData(data)
            setIsFirstTime(false)
            setShowFarmSetup(false)
            addNotification({
              title: "Farm Setup Complete!",
              message: `Welcome to CropLink, ${data.farmName}! Your farm profile has been created.`,
              type: "success",
            })
          }}
        />

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />

      {/* User Profile Modal */}
      {user && (
        <UserProfile
          user={user}
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}
