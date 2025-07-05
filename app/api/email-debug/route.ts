import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET() {
  try {
    console.log("🔍 Starting email debug check...")

    // Test SMTP configuration with your Gmail
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

    console.log("🔄 Testing SMTP connection...")

    try {
      const verified = await transporter.verify()
      console.log("✅ SMTP verification result:", verified)

      return NextResponse.json({
        status: "success",
        message: "Email service is working correctly",
        details: {
          smtp: {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            user: "natarajmurali56@gmail.com",
          },
          verified: true,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (verifyError: any) {
      console.error("❌ SMTP verification failed:", verifyError)

      return NextResponse.json(
        {
          status: "error",
          message: "SMTP verification failed",
          error: {
            message: verifyError.message,
            code: verifyError.code,
            command: verifyError.command,
            response: verifyError.response,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("❌ Email debug error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Email debug failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
