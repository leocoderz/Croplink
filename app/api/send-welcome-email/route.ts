import { type NextRequest, NextResponse } from "next/server"
import { emailNotificationService } from "@/lib/email-notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 })
    }

    const result = await emailNotificationService.sendNotification({
      to: email,
      name,
      type: "welcome",
    })

    return NextResponse.json({
      success: result.success,
      message: result.success ? "Welcome email sent successfully!" : "Welcome email failed",
      messageId: result.messageId,
      recipient: email,
      error: result.error,
    })
  } catch (error: any) {
    console.error("❌ Welcome email error:", error)
    return NextResponse.json({
      success: true, // Don't block signup
      message: "Account created successfully",
      error: error.message,
    })
  }
}
