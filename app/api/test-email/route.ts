import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { email, name = "Test User" } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("🧪 Testing email to:", email)

    // Create transporter with your Gmail
    const transporter = nodemailer.createTransporter({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "natarajmurali56@gmail.com",
        pass: "msle ntny oyxr ogia",
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify connection
    console.log("🔄 Verifying SMTP...")
    await transporter.verify()
    console.log("✅ SMTP verified")

    // Send test email
    const result = await transporter.sendMail({
      from: '"AgriApp Test" <natarajmurali56@gmail.com>',
      to: email,
      subject: "🧪 AgriApp Email Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1>🧪 Email Test Successful!</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; margin-top: -1px;">
            <p>Hello ${name}!</p>
            <p>This is a test email from AgriApp. If you received this, our email system is working correctly!</p>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent to: ${email}</li>
              <li>Time: ${new Date().toISOString()}</li>
              <li>SMTP: Gmail (natarajmurali56@gmail.com)</li>
            </ul>
          </div>
          <div style="background: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p>AgriApp Email Service Test</p>
          </div>
        </div>
      `,
      text: `
Email Test Successful!

Hello ${name}!

This is a test email from AgriApp. If you received this, our email system is working correctly!

Test Details:
- Sent to: ${email}
- Time: ${new Date().toISOString()}
- SMTP: Gmail (natarajmurali56@gmail.com)

AgriApp Email Service Test
      `,
    })

    console.log("✅ Test email sent:", result.messageId)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      messageId: result.messageId,
      details: {
        to: email,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("❌ Test email failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: {
          code: error.code,
          command: error.command,
          response: error.response,
        },
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email test endpoint",
    usage: "POST with { email: 'test@example.com', name: 'Test User' }",
  })
}
