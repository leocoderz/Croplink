import { type NextRequest, NextResponse } from "next/server"
import { emailNotificationService } from "@/lib/email-notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, location, device } = body

    if (!email || !name) {
      return NextResponse.json({ message: "Email and name are required" }, { status: 400 })
    }

    const result = await emailNotificationService.sendNotification({
      to: email,
      name,
      type: "login_alert",
      data: {
        location: location || "Unknown location",
        device: device || "Unknown device",
      },
    })

    return NextResponse.json({
      success: result.success,
      message: result.success ? "Login alert sent successfully" : "Login alert failed",
      messageId: result.messageId,
      error: result.error,
    })
  } catch (error: any) {
    console.error("❌ Login alert error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send login alert",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
