import { type NextRequest, NextResponse } from "next/server"
import { emailNotificationService } from "@/lib/email-notification-service"

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Email notification API called")

    const body = await request.json()
    const { to, name, type, data } = body

    console.log("📧 Notification request:", { to, name, type })

    if (!to || !type) {
      return NextResponse.json({ message: "Email and notification type are required" }, { status: 400 })
    }

    // Send notification
    const result = await emailNotificationService.sendNotification({
      to,
      name: name || "Farmer",
      type,
      data: data || {},
    })

    return NextResponse.json({
      success: result.success,
      message: result.success ? "Notification sent successfully" : "Notification failed",
      messageId: result.messageId,
      type,
      recipient: to,
      error: result.error,
    })
  } catch (error: any) {
    console.error("❌ Notification API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send notification",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
