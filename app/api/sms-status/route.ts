import { type NextRequest, NextResponse } from "next/server"

// SMS Status endpoint for checking SMS delivery status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get("messageId")

    if (!messageId) {
      return NextResponse.json({ message: "Message ID is required" }, { status: 400 })
    }

    // Mock status check - in production, query your SMS provider's API
    const mockStatus = {
      messageId,
      status: "delivered", // delivered, sent, failed, pending
      deliveredAt: new Date().toISOString(),
      cost: 0.0075,
      provider: "mock",
    }

    console.log("📱 SMS Status check:", mockStatus)

    return NextResponse.json({
      success: true,
      ...mockStatus,
    })
  } catch (error: any) {
    console.error("❌ SMS Status error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to check SMS status",
      },
      { status: 500 },
    )
  }
}
