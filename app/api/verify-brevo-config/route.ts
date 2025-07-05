import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 Verifying Brevo API configuration...")

    const apiKey = "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"

    // Test API key validity by getting account info
    const response = await fetch("https://api.brevo.com/v3/account", {
      method: "GET",
      headers: {
        "api-key": apiKey,
      },
    })

    console.log("📊 Account API Response Status:", response.status)

    if (response.ok) {
      const accountData = await response.json()
      console.log("✅ Brevo Account Data:", accountData)

      return NextResponse.json({
        success: true,
        message: "Brevo API key is valid!",
        account: accountData,
        apiKey: apiKey,
        timestamp: new Date().toISOString(),
      })
    } else {
      const errorText = await response.text()
      console.error("❌ Account API Error:", errorText)

      return NextResponse.json({
        success: false,
        error: "Invalid API key or account issue",
        status: response.status,
        response: errorText,
        apiKey: apiKey,
      })
    }
  } catch (error: any) {
    console.error("💥 Brevo config verification error:", error)

    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
