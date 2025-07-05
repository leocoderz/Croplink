import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Testing Brevo API directly...")

    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const testName = name || "Test User"

    console.log("📧 Testing email to:", email)
    console.log("👤 Name:", testName)

    // Test Brevo API directly
    const brevoPayload = {
      sender: {
        name: "AgriApp Team",
        email: "natarajaiml@gmail.com",
      },
      to: [
        {
          email: email,
          name: testName,
        },
      ],
      subject: "🧪 AgriApp Test Email - Please Confirm Receipt",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Test Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #10b981; text-align: center;">🧪 AgriApp Test Email</h1>
            <p>Hello ${testName},</p>
            <p>This is a test email from AgriApp to verify that our email delivery system is working correctly.</p>
            <p><strong>If you receive this email, please reply to confirm receipt.</strong></p>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>Sent to: ${email}</li>
                <li>Timestamp: ${new Date().toISOString()}</li>
                <li>Service: Brevo API</li>
                <li>API Key: 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</li>
              </ul>
            </div>
            <p>Best regards,<br>The AgriApp Team</p>
            <p style="font-size: 12px; color: #666; margin-top: 30px;">
              This is a test email. If you didn't request this, please ignore it.
            </p>
          </div>
        </body>
        </html>
      `,
      textContent: `
AgriApp Test Email

Hello ${testName},

This is a test email from AgriApp to verify that our email delivery system is working correctly.

If you receive this email, please reply to confirm receipt.

Test Details:
- Sent to: ${email}
- Timestamp: ${new Date().toISOString()}
- Service: Brevo API

Best regards,
The AgriApp Team

This is a test email. If you didn't request this, please ignore it.
      `,
    }

    console.log("📤 Sending test email via Brevo API...")
    console.log(
      "🔑 Using API Key:",
      "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",
    )

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "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",
      },
      body: JSON.stringify(brevoPayload),
    })

    console.log("📊 Brevo API Response Status:", response.status)
    console.log("📊 Brevo API Response Headers:", Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Brevo API Success Response:", result)

      return NextResponse.json({
        success: true,
        message: "Test email sent successfully via Brevo!",
        brevoResponse: result,
        messageId: result.messageId,
        recipient: email,
        timestamp: new Date().toISOString(),
      })
    } else {
      const errorText = await response.text()
      console.error("❌ Brevo API Error Response:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      return NextResponse.json({
        success: false,
        error: "Brevo API failed",
        status: response.status,
        brevoError: errorData,
        apiKey: "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",
        payload: brevoPayload,
      })
    }
  } catch (error: any) {
    console.error("💥 Test email error:", error)

    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Brevo API Test Endpoint",
    usage: "POST with { email: 'test@example.com', name: 'Test User' }",
    apiKey: "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",
  })
}
