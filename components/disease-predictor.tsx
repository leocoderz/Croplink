"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Leaf, AlertTriangle, CheckCircle, Info, X, Download, Share, ImageIcon } from "lucide-react"

interface DiseasePredictorProps {
  onNotification?: (notification: any) => void
}

export function DiseasePredictor({ onNotification }: DiseasePredictorProps = {}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([])
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          setSelectedImage(result)
          setImageError(false)
          setResult(null)
        }
      }
      reader.onerror = () => {
        alert("Failed to read the image file")
        setImageError(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = () => {
    if (!selectedImage) return

    setIsAnalyzing(true)

    // Simulate more realistic AI analysis
    setTimeout(() => {
      // Analyze image characteristics (this would be done by actual AI in production)
      const imageAnalysis = analyzeImageCharacteristics(selectedImage)
      const detectedDisease = identifyDisease(imageAnalysis)

      const newResult = {
        ...detectedDisease,
        timestamp: new Date(),
        image: selectedImage,
        imageAnalysis,
      }

      setResult(newResult)
      setAnalysisHistory((prev) => [newResult, ...prev.slice(0, 9)]) // Keep last 10 analyses
      setIsAnalyzing(false)

      // Send notification
      onNotification?.({
        title: "Disease Analysis Complete",
        message: `${detectedDisease.disease} detected with ${detectedDisease.confidence}% confidence.`,
        type: detectedDisease.severity === "High" ? "warning" : "info",
      })

      // Save to localStorage for persistence
      const savedAnalyses = JSON.parse(localStorage.getItem("croplink-disease-analyses") || "[]")
      savedAnalyses.unshift(newResult)
      localStorage.setItem("croplink-disease-analyses", JSON.stringify(savedAnalyses.slice(0, 10)))
    }, 3000)
  }

  // Add realistic image analysis function
  const analyzeImageCharacteristics = (imageData: string) => {
    // In a real app, this would use computer vision
    // For now, we'll simulate based on image properties
    return {
      hasSpots: Math.random() > 0.5,
      hasDiscoloration: Math.random() > 0.4,
      hasWilting: Math.random() > 0.6,
      leafCondition: Math.random() > 0.5 ? "damaged" : "healthy",
      colorAnalysis: {
        dominantColors: ["green", "brown", "yellow"],
        healthyGreenPercentage: Math.floor(Math.random() * 100),
      },
    }
  }

  // Add disease identification logic
  const identifyDisease = (analysis: any) => {
    const diseases = [
      {
        disease: "Leaf Blight",
        confidence: analysis.hasSpots ? 85 + Math.floor(Math.random() * 10) : 60 + Math.floor(Math.random() * 20),
        severity: analysis.hasSpots && analysis.hasDiscoloration ? "High" : "Moderate",
        description: "Leaf blight is a fungal disease causing brown or black spots on leaves.",
        treatment: [
          "Remove affected leaves immediately",
          "Apply copper-based fungicide",
          "Improve air circulation around plants",
          "Avoid overhead watering",
          "Apply fungicide every 7-10 days",
        ],
        prevention: [
          "Plant resistant varieties",
          "Ensure proper spacing between plants",
          "Regular field inspection",
          "Crop rotation with non-host plants",
          "Maintain proper soil drainage",
        ],
      },
      {
        disease: "Powdery Mildew",
        confidence: analysis.hasDiscoloration
          ? 80 + Math.floor(Math.random() * 15)
          : 50 + Math.floor(Math.random() * 25),
        severity: "Low",
        description: "A fungal disease appearing as white powdery spots on leaves and stems.",
        treatment: [
          "Apply sulfur-based fungicide",
          "Remove infected plant parts",
          "Increase air circulation",
          "Apply neem oil spray",
        ],
        prevention: [
          "Avoid overhead watering",
          "Plant in sunny locations",
          "Proper plant spacing",
          "Regular monitoring",
        ],
      },
      {
        disease: "Healthy Plant",
        confidence:
          analysis.leafCondition === "healthy"
            ? 90 + Math.floor(Math.random() * 10)
            : 30 + Math.floor(Math.random() * 20),
        severity: "None",
        description: "Your plant appears to be healthy with no visible signs of disease.",
        treatment: [
          "Continue current care routine",
          "Monitor regularly for changes",
          "Maintain proper watering",
          "Ensure adequate nutrition",
        ],
        prevention: ["Regular inspection", "Proper spacing", "Good air circulation", "Balanced fertilization"],
      },
    ]

    // Select disease based on analysis
    if (analysis.leafCondition === "healthy" && !analysis.hasSpots && !analysis.hasDiscoloration) {
      return diseases[2] // Healthy plant
    } else if (analysis.hasSpots) {
      return diseases[0] // Leaf blight
    } else {
      return diseases[1] // Powdery mildew
    }
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setResult(null)
    setImageError(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadReport = () => {
    if (!result) return

    const reportData = {
      disease: result.disease,
      confidence: result.confidence,
      severity: result.severity,
      timestamp: result.timestamp,
      treatment: result.treatment,
      prevention: result.prevention,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `disease-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareReport = async () => {
    if (!result) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Disease Detection: ${result.disease}`,
          text: `Detected ${result.disease} with ${result.confidence}% confidence. Severity: ${result.severity}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Disease Detection Report\n\nDisease: ${result.disease}\nConfidence: ${result.confidence}%\nSeverity: ${result.severity}\nDate: ${result.timestamp.toLocaleDateString()}`
      navigator.clipboard.writeText(shareText)
      alert("Report copied to clipboard!")
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const commonDiseases = [
    { name: "Leaf Blight", crops: ["Rice", "Wheat", "Corn"], severity: "High", symptoms: "Brown spots on leaves" },
    {
      name: "Powdery Mildew",
      crops: ["Tomato", "Cucumber", "Grape"],
      severity: "Medium",
      symptoms: "White powdery coating",
    },
    { name: "Root Rot", crops: ["Potato", "Carrot", "Onion"], severity: "High", symptoms: "Wilting and yellowing" },
    { name: "Rust Disease", crops: ["Wheat", "Barley", "Oats"], severity: "Medium", symptoms: "Orange-red pustules" },
    { name: "Bacterial Wilt", crops: ["Tomato", "Pepper", "Eggplant"], severity: "High", symptoms: "Sudden wilting" },
    {
      name: "Mosaic Virus",
      crops: ["Cucumber", "Squash", "Melon"],
      severity: "Medium",
      symptoms: "Mottled leaf pattern",
    },
  ]

  useEffect(() => {
    const savedAnalyses = JSON.parse(localStorage.getItem("croplink-disease-analyses") || "[]")
    setAnalysisHistory(savedAnalyses)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Disease Detection</h1>
        <p className="text-gray-600 dark:text-gray-300">Upload a photo to identify crop diseases</p>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <CardContent className="p-6">
          {!selectedImage ? (
            <div className="text-center">
              <div className="w-16 h-16 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 bg-lime-50">
                <Camera className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Plant Image</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Take a clear photo of the affected plant part</p>

              <div className="flex flex-col space-y-2">
                <Button
                  className="bg-green-500 hover:bg-green-600 w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload from Gallery
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Supported formats: JPG, PNG, WebP (Max 5MB)
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                {imageError ? (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load image</p>
                      <Button variant="outline" size="sm" onClick={resetAnalysis} className="mt-2">
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Uploaded plant"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={handleImageError}
                    onLoad={() => setImageError(false)}
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetAnalysis}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={analyzeImage}
                  disabled={isAnalyzing || imageError}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Leaf className="h-4 w-4 mr-2" />
                      Analyze Disease
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetAnalysis} disabled={isAnalyzing}>
                  Reset
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-400">Analyzing Image...</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">AI is examining your plant for diseases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Result */}
      {result && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-orange-800 dark:text-orange-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Disease Detected
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={downloadReport}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={shareReport}>
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{result.disease}</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.description}</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  {result.confidence}% confident
                </Badge>
                <div
                  className={`text-sm font-medium ${
                    result.severity === "High"
                      ? "text-red-600"
                      : result.severity === "Moderate"
                        ? "text-orange-600"
                        : "text-yellow-600"
                  }`}
                >
                  {result.severity} severity
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Treatment Steps
              </h4>
              <ul className="space-y-2">
                {result.treatment.map((step: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="w-6 h-6 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Prevention Tips
              </h4>
              <ul className="space-y-1">
                {result.prevention.map((tip: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              Analysis completed on {result.timestamp.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common Diseases */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Common Diseases</h3>
        <div className="space-y-2">
          {commonDiseases.map((disease, index) => (
            <Card
              key={index}
              className="border-0 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{disease.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Affects: {disease.crops.join(", ")}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{disease.symptoms}</p>
                  </div>
                  <Badge variant={disease.severity === "High" ? "destructive" : "secondary"}>{disease.severity}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">📸 Photography Tips</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Take photos in good natural lighting</li>
            <li>• Focus on affected areas clearly</li>
            <li>• Include some healthy parts for comparison</li>
            <li>• Avoid blurry or distant shots</li>
            <li>• Clean the camera lens before taking photos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
