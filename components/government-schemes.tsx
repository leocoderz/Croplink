"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, DollarSign, FileText, ExternalLink } from "lucide-react"

interface GovernmentSchemesProps {
  onNotification?: (notification: any) => void
}

export function GovernmentSchemes({ onNotification }: GovernmentSchemesProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const schemes = [
    {
      id: 1,
      title: "PM-KISAN Scheme",
      category: "subsidy",
      amount: "₹6,000/year",
      deadline: "2024-03-31",
      status: "active",
      description: "Direct income support to farmers with cultivable land",
      eligibility: "Small and marginal farmers",
      documents: ["Aadhaar Card", "Land Records", "Bank Details"],
      benefits: ["Direct cash transfer", "No intermediaries", "Quick processing"],
    },
    {
      id: 2,
      title: "Crop Insurance Scheme",
      category: "insurance",
      amount: "Up to ₹2,00,000",
      deadline: "2024-04-15",
      status: "active",
      description: "Comprehensive risk solution for crop loss",
      eligibility: "All farmers growing notified crops",
      documents: ["Land Records", "Sowing Certificate", "Bank Account"],
      benefits: ["Weather risk coverage", "Technology support", "Quick claim settlement"],
    },
    {
      id: 3,
      title: "Soil Health Card Scheme",
      category: "technology",
      amount: "Free",
      deadline: "Ongoing",
      status: "active",
      description: "Soil testing and nutrient management advice",
      eligibility: "All farmers",
      documents: ["Land Records", "Farmer ID"],
      benefits: ["Free soil testing", "Fertilizer recommendations", "Improved productivity"],
    },
    {
      id: 4,
      title: "Kisan Credit Card",
      category: "credit",
      amount: "Up to ₹3,00,000",
      deadline: "Ongoing",
      status: "active",
      description: "Easy access to credit for agricultural needs",
      eligibility: "Farmers with land ownership",
      documents: ["Land Records", "Income Certificate", "Bank Statements"],
      benefits: ["Low interest rates", "Flexible repayment", "Insurance coverage"],
    },
    {
      id: 5,
      title: "Organic Farming Scheme",
      category: "subsidy",
      amount: "₹50,000/hectare",
      deadline: "2024-05-30",
      status: "new",
      description: "Support for organic farming practices",
      eligibility: "Farmers adopting organic methods",
      documents: ["Organic Certification", "Land Records", "Training Certificate"],
      benefits: ["Financial assistance", "Technical support", "Market linkage"],
    },
  ]

  const categories = [
    { id: "all", label: "All Schemes", count: schemes.length },
    { id: "subsidy", label: "Subsidies", count: schemes.filter((s) => s.category === "subsidy").length },
    { id: "insurance", label: "Insurance", count: schemes.filter((s) => s.category === "insurance").length },
    { id: "credit", label: "Credit", count: schemes.filter((s) => s.category === "credit").length },
    { id: "technology", label: "Technology", count: schemes.filter((s) => s.category === "technology").length },
  ]

  const filteredSchemes =
    selectedCategory === "all" ? schemes : schemes.filter((scheme) => scheme.category === selectedCategory)

  const [expandedScheme, setExpandedScheme] = useState<number | null>(null)

  // Add state for applications
  const [applications, setApplications] = useState<any[]>([])

  // Load saved applications
  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem("croplink-applications") || "[]")
    setApplications(savedApplications)
  }, [])

  // Add application function
  const applyForScheme = (scheme: any) => {
    const newApplication = {
      id: Date.now(),
      schemeId: scheme.id,
      schemeName: scheme.title,
      appliedDate: new Date().toISOString(),
      status: "Under Review",
      documents: scheme.documents,
      amount: scheme.amount,
    }

    const updatedApplications = [...applications, newApplication]
    setApplications(updatedApplications)
    localStorage.setItem("croplink-applications", JSON.stringify(updatedApplications))

    onNotification?.({
      title: "Application Submitted",
      message: `Your application for ${scheme.title} has been submitted successfully.`,
      type: "success",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Government Schemes</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover beneficial programs for farmers</p>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={`whitespace-nowrap ${selectedCategory === category.id ? "bg-green-500 hover:bg-green-600" : ""}`}
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-green-700 dark:text-green-400">5</div>
            <div className="text-xs text-green-600 dark:text-green-500">Active Schemes</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blue-700">₹8.5L</div>
            <div className="text-xs text-blue-600">Max Benefit</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-orange-700">2</div>
            <div className="text-xs text-orange-600">New This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{scheme.title}</h3>
                      {scheme.status === "new" && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                  >
                    {expandedScheme === scheme.id ? "Less" : "More"}
                  </Button>
                </div>

                {/* Quick Info */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{scheme.amount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>{scheme.deadline}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {scheme.category}
                  </Badge>
                </div>

                {/* Expanded Details */}
                {expandedScheme === scheme.id && (
                  <div className="space-y-4 pt-3 border-t border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Eligibility</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.eligibility}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Required Documents</h4>
                      <div className="flex flex-wrap gap-1">
                        {scheme.documents.map((doc, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Benefits</h4>
                      <ul className="space-y-1">
                        {scheme.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        onClick={() => applyForScheme(scheme)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Apply Now
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Learn More
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Status */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-400 flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Your Applications ({applications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {applications.length > 0 ? (
              applications.slice(0, 5).map((app, index) => (
                <div key={app.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                  <div>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{app.schemeName}</span>
                    <p className="text-xs text-gray-500">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <Badge
                    variant={
                      app.status === "Approved" ? "default" : app.status === "Rejected" ? "destructive" : "secondary"
                    }
                    className={app.status === "Approved" ? "bg-green-500 text-white" : ""}
                  >
                    {app.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">No applications yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Apply for schemes to see them here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4 text-center">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Contact our support team for assistance with applications
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              Call Support
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Chat Help
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
