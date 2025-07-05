import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test Gmail SMTP connection
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.default.createTransporter({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "agriapp.notifications@gmail.com",
        pass: "msle ntny oyxr ogia",
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    console.log("🔄 Testing SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection successful")

    return NextResponse.json({
      status: "healthy",
      message: "Email service is working correctly",
      smtp: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        service: "gmail",
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Email service check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Email service is not working",
        error: {
          message: error.message,
          code: error.code,
          command: error.command,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
