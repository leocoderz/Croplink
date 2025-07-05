import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// In-memory storage for password reset tokens
const resetTokens: { [key: string]: { email: string; expires: number } } = {}

// In-memory user storage (same as other auth endpoints)
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Forgot password request started")

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 })
    }

    // Check if user exists
    const user = users.find((u) => u.email === email.toLowerCase().trim())

    // Always return success to prevent email enumeration attacks
    // But only send email if user actually exists
    if (user) {
      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const expires = Date.now() + 3600000 // 1 hour from now

      // Store reset token
      resetTokens[resetToken] = {
        email: user.email,
        expires: expires,
      }

      console.log("✅ Reset token generated for:", user.email)

      // Send password reset email
      try {
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

        const resetUrl = `${request.nextUrl.origin}/reset-password?token=${resetToken}`

        const emailContent = {
          from: '"AgriApp Team" <natarajmurali56@gmail.com>',
          to: user.email,
          subject: "🔐 Reset Your AgriApp Password",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Reset Your Password</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: white; padding: 30px; border: 1px solid #ddd; }
                .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
                .warning { background: #fef3cd; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 15px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔐 Password Reset Request</h1>
                  <p>AgriApp Account Security</p>
                </div>
                
                <div class="content">
                  <h2>Hello ${user.name}!</h2>
                  
                  <p>We received a request to reset your AgriApp password. If you made this request, click the button below to reset your password:</p>
                  
                  <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">🔐 Reset My Password</a>
                  </div>
                  
                  <div class="warning">
                    <strong>⚠️ Important Security Information:</strong>
                    <ul>
                      <li>This link will expire in 1 hour</li>
                      <li>If you didn't request this reset, please ignore this email</li>
                      <li>Never share this link with anyone</li>
                    </ul>
                  </div>
                  
                  <p>If the button doesn't work, copy and paste this link into your browser:</p>
                  <p style="word-break: break-all; color: #10b981;">${resetUrl}</p>
                  
                  <p>Need help? Contact us at <strong>natarajmurali56@gmail.com</strong></p>
                </div>
                
                <div class="footer">
                  <p>This email was sent to <strong>${user.email}</strong></p>
                  <p><strong>AgriApp Team</strong> | © 2024 All rights reserved</p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
Password Reset Request - AgriApp

Hello ${user.name}!

We received a request to reset your AgriApp password. If you made this request, use the link below to reset your password:

${resetUrl}

Important:
- This link will expire in 1 hour
- If you didn't request this reset, please ignore this email
- Never share this link with anyone

Need help? Contact us at natarajmurali56@gmail.com

AgriApp Team
          `,
        }

        await transporter.sendMail(emailContent)
        console.log("✅ Password reset email sent to:", user.email)
      } catch (emailError: any) {
        console.error("❌ Failed to send reset email:", emailError)
        // Don't fail the request if email fails
      }
    } else {
      console.log("⚠️ Password reset requested for non-existent email:", email)
    }

    // Always return success message
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent you a password reset link.",
    })
  } catch (error: any) {
    console.error("❌ Forgot password error:", error)
    return NextResponse.json({ message: "Password reset failed. Please try again." }, { status: 500 })
  }
}
