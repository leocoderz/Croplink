import { type NextRequest, NextResponse } from "next/server"
import { emailNotificationService } from "@/lib/email-notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, type = "welcome", name = "Test User" } = body

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    console.log(`🧪 Testing ${type} notification to:`, email)

    // Test data for different notification types
    const testData = {
      welcome: {},
      login_alert: {
        location: "Mumbai, India",
        device: "Chrome on Windows",
      },
      weather_alert: {
        alertType: "Heavy Rain Warning",
        message: "Heavy rainfall expected in your area for the next 24 hours",
        temperature: "28°C",
        conditions: "Heavy rain with thunderstorms",
      },
      disease_alert: {
        cropName: "Tomato",
        diseaseName: "Late Blight",
        severity: "High",
        treatment: "Apply copper-based fungicide immediately and improve air circulation",
      },
      scheme_notification: {
        schemeName: "PM-KISAN Samman Nidhi",
        description: "Direct income support to farmers",
        deadline: "March 31, 2024",
        eligibility: "Small and marginal farmers with cultivable land",
      },
      activity_summary: {
        period: "this week",
        diseaseScans: 5,
        weatherChecks: 12,
        aiQuestions: 8,
        schemesViewed: 3,
      },
    }

    const result = await emailNotificationService.sendNotification({
      to: email,
      name,
      type: type as any,
      data: testData[type as keyof typeof testData] || {},
    })

    return NextResponse.json({
      success: result.success,
      message: `Test ${type} notification ${result.success ? "sent" : "failed"}`,
      messageId: result.messageId,
      type,
      recipient: email,
      error: result.error,
    })
  } catch (error: any) {
    console.error("❌ Test notification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Test notification failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
