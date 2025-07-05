import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Testing SMS functionality...")

    // Test SMS sending
    const testPhone = "+1234567890" // Test phone number
    const testMessage = "🧪 This is a test SMS from AgriApp. SMS functionality is working!"

    const smsResponse = await fetch(`${request.nextUrl.origin}/api/send-sms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: testPhone,
        message: testMessage,
        type: "test",
      }),
    })

    const smsResult = await smsResponse.json()

    return NextResponse.json({
      success: true,
      message: "SMS test completed",
      smsTest: {
        success: smsResult.success,
        messageId: smsResult.messageId,
        provider: smsResult.provider,
        status: smsResult.status,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ SMS test failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: "SMS test failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
