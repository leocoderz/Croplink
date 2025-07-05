"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Leaf, MapPin, Thermometer, X } from "lucide-react"

interface FarmSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (farmData: any) => void
}

export function FarmSetupModal({ isOpen, onClose, onSave }: FarmSetupModalProps) {
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    totalArea: "",
    soilType: "",
    climateZone: "",
    primaryCrops: "",
    irrigationType: "",
    farmingExperience: "",
    currentCrops: "",
    notes: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    const farmData = {
      ...formData,
      totalArea: Number.parseFloat(formData.totalArea) || 0,
      currentCrops: Number.parseInt(formData.currentCrops) || 0,
      activeFields: Math.ceil((Number.parseFloat(formData.totalArea) || 0) / 3),
      soilMoisture: 65 + Math.random() * 20, // Initial realistic value
      healthScore: 80 + Math.random() * 15, // Initial good health score
      efficiency: 75 + Math.random() * 20, // Initial efficiency
      irrigationStatus: formData.irrigationType ? "Active" : "Manual",
      weatherCondition: "Favorable",
      nextHarvest: "30-45 days",
      totalYield: "0 tons",
      harvestReady: 0,
      lastUpdated: new Date().toISOString(),
      isSetup: true,
      setupDate: new Date().toISOString(),
    }

    onSave(farmData)
    onClose()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Basic Information</h3>
              <p className="text-gray-600 dark:text-gray-400">Tell us about your farm</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="farmName">Farm Name</Label>
                <Input
                  id="farmName"
                  placeholder="e.g., Green Valley Farm"
                  value={formData.farmName}
                  onChange={(e) => handleInputChange("farmName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Bangalore, Karnataka"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="totalArea">Total Area (acres)</Label>
                <Input
                  id="totalArea"
                  type="number"
                  placeholder="e.g., 10.5"
                  value={formData.totalArea}
                  onChange={(e) => handleInputChange("totalArea", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="farmingExperience">Farming Experience</Label>
                <Select onValueChange={(value) => handleInputChange("farmingExperience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (3-10 years)</SelectItem>
                    <SelectItem value="experienced">Experienced (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Farm Details</h3>
              <p className="text-gray-600 dark:text-gray-400">Environmental and soil information</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Select onValueChange={(value) => handleInputChange("soilType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay Soil</SelectItem>
                    <SelectItem value="sandy">Sandy Soil</SelectItem>
                    <SelectItem value="loamy">Loamy Soil</SelectItem>
                    <SelectItem value="silt">Silt Soil</SelectItem>
                    <SelectItem value="red">Red Soil</SelectItem>
                    <SelectItem value="black">Black Soil</SelectItem>
                    <SelectItem value="alluvial">Alluvial Soil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="climateZone">Climate Zone</Label>
                <Select onValueChange={(value) => handleInputChange("climateZone", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select climate zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tropical">Tropical</SelectItem>
                    <SelectItem value="subtropical">Subtropical</SelectItem>
                    <SelectItem value="temperate">Temperate</SelectItem>
                    <SelectItem value="arid">Arid/Semi-arid</SelectItem>
                    <SelectItem value="coastal">Coastal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="irrigationType">Irrigation System</Label>
                <Select onValueChange={(value) => handleInputChange("irrigationType", value)}>
                  <SelectTrigger>
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
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Thermometer className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Current Crops</h3>
              <p className="text-gray-600 dark:text-gray-400">What are you growing now?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryCrops">Primary Crops</Label>
                <Input
                  id="primaryCrops"
                  placeholder="e.g., Rice, Wheat, Tomatoes"
                  value={formData.primaryCrops}
                  onChange={(e) => handleInputChange("primaryCrops", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="currentCrops">Number of Crop Varieties</Label>
                <Input
                  id="currentCrops"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.currentCrops}
                  onChange={(e) => handleInputChange("currentCrops", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific challenges, goals, or additional information..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Farm Setup</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={!formData.farmName || !formData.location || !formData.totalArea}
              >
                Complete Setup
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
