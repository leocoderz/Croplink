"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, MapPin, Calendar, LogOut, Edit, Camera, X, Save, Bell, Globe, Leaf } from "lucide-react"

interface UserProfileProps {
  user: any
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export function UserProfile({ user: initialUser, isOpen, onClose, onLogout }: UserProfileProps) {
  const [user, setUser] = useState(initialUser)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    location: "",
    farmSize: "",
    primaryCrops: [] as string[],
    farmingType: "",
  })
  const [settings, setSettings] = useState({
    language: "en",
    notifications: {
      email: true,
      push: true,
      weather: true,
      diseases: true,
    },
  })

  // Fetch real user data when component opens
  useEffect(() => {
    if (isOpen && user) {
      fetchUserProfile()
    }
  }, [isOpen])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("agri-app-token")
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setEditForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          farmSize: data.user.farmSize || "",
          primaryCrops: data.user.primaryCrops || [],
          farmingType: data.user.farmingType || "",
        })
        setSettings({
          language: data.user.language || "en",
          notifications: data.user.notifications || {
            email: true,
            push: true,
            weather: true,
            diseases: true,
          },
        })
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("agri-app-token")
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editForm,
          ...settings,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsEditing(false)

        // Update localStorage
        localStorage.setItem("agri-app-user", JSON.stringify(data.user))
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logActivity = async (activityType: string, activityData: any = {}) => {
    try {
      const token = localStorage.getItem("agri-app-token")
      await fetch("/api/user/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activityType,
          activityData,
        }),
      })
    } catch (error) {
      console.error("Failed to log activity:", error)
    }
  }

  if (!isOpen) return null

  const userStats = [
    { label: "Crops Monitored", value: user?.stats?.cropsMonitored || 0, color: "bg-green-500" },
    { label: "Disease Scans", value: user?.stats?.diseaseScans || 0, color: "bg-blue-500" },
    { label: "Weather Alerts", value: user?.stats?.weatherAlerts || 0, color: "bg-orange-500" },
    { label: "Days Active", value: user?.stats?.activeDays || 0, color: "bg-purple-500" },
  ]

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const formatActivityAction = (activityType: string) => {
    const actions = {
      disease_scan: "Disease scan completed",
      weather_check: "Weather forecast checked",
      scheme_view: "Government scheme viewed",
      chat_session: "AI assistant consulted",
      analytics_view: "Farm analytics reviewed",
    }
    return actions[activityType] || activityType
  }

  const cropOptions = [
    "Rice",
    "Wheat",
    "Corn",
    "Tomato",
    "Potato",
    "Onion",
    "Cotton",
    "Sugarcane",
    "Soybean",
    "Groundnut",
    "Sunflower",
    "Mustard",
    "Barley",
    "Millet",
    "Pulses",
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Profile Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="relative text-center border-b">
            <Button variant="ghost" size="sm" onClick={onClose} className="absolute right-2 top-2 h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>

            {/* Profile Picture */}
            <div className="relative mx-auto mb-4">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 h-6 w-6 p-0 rounded-full bg-blue-500 hover:bg-blue-600"
              >
                <Camera className="h-3 w-3 text-white" />
              </Button>
            </div>

            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {user?.farmingType || "Smart Farmer"}
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="p-6 space-y-6">
                {/* User Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          placeholder="City, State, Country"
                        />
                      </div>
                      <div>
                        <Label htmlFor="farmSize">Farm Size</Label>
                        <Input
                          id="farmSize"
                          value={editForm.farmSize}
                          onChange={(e) => setEditForm({ ...editForm, farmSize: e.target.value })}
                          placeholder="e.g., 5 acres"
                        />
                      </div>
                      <div>
                        <Label htmlFor="farmingType">Farming Type</Label>
                        <Select
                          value={editForm.farmingType}
                          onValueChange={(value) => setEditForm({ ...editForm, farmingType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select farming type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="organic">Organic Farming</SelectItem>
                            <SelectItem value="conventional">Conventional Farming</SelectItem>
                            <SelectItem value="hydroponic">Hydroponic Farming</SelectItem>
                            <SelectItem value="mixed">Mixed Farming</SelectItem>
                            <SelectItem value="subsistence">Subsistence Farming</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Primary Crops</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {cropOptions.map((crop) => (
                            <label key={crop} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={editForm.primaryCrops.includes(crop)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditForm({
                                      ...editForm,
                                      primaryCrops: [...editForm.primaryCrops, crop],
                                    })
                                  } else {
                                    setEditForm({
                                      ...editForm,
                                      primaryCrops: editForm.primaryCrops.filter((c) => c !== crop),
                                    })
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">{crop}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                        </div>
                      </div>

                      {user?.phone && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{user.phone}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user?.location || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Leaf className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Farm Size</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user?.farmSize || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Member Since</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {userStats.map((stat, index) => (
                      <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div
                          className={`w-8 h-8 ${stat.color} rounded-full mx-auto mb-2 flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-sm">{stat.value}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6 space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      <Globe className="h-5 w-5 inline mr-2" />
                      Language & Region
                    </h3>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => setSettings({ ...settings, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                        <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                        <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      <Bell className="h-5 w-5 inline mr-2" />
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                        </div>
                        <Switch
                          checked={settings.notifications.email}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, email: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications</p>
                        </div>
                        <Switch
                          checked={settings.notifications.push}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, push: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Weather Alerts</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Get weather-related notifications</p>
                        </div>
                        <Switch
                          checked={settings.notifications.weather}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, weather: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Disease Alerts</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Get crop disease notifications</p>
                        </div>
                        <Switch
                          checked={settings.notifications.diseases}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, diseases: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="p-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {user?.recentActivity?.length > 0 ? (
                      user.recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatActivityAction(activity.action)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatActivityTime(activity.time)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="p-6 border-t">
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
