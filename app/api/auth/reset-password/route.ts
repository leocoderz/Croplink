import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for password reset tokens
const resetTokens: { [key: string]: { email: string; expires: number } } = {}

// In-memory user storage (same as other auth endpoints)
const users: any[] = []

async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs")
  return bcrypt.default.hash(password, 12)
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Password reset started")

    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: "Token and new password are required" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        {
          message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        },
        { status: 400 },
      )
    }

    // Check if token exists and is valid
    const tokenData = resetTokens[token]
    if (!tokenData) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 })
    }

    // Check if token has expired
    if (Date.now() > tokenData.expires) {
      delete resetTokens[token] // Clean up expired token
      return NextResponse.json({ message: "Reset token has expired. Please request a new one." }, { status: 400 })
    }

    // Find user by email
    const user = users.find((u) => u.email === tokenData.email)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password
    user.password = hashedPassword
    user.updatedAt = new Date().toISOString()

    // Remove used token
    delete resetTokens[token]

    console.log("✅ Password reset successful for:", user.email)

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully. You can now sign in with your new password.",
    })
  } catch (error: any) {
    console.error("❌ Password reset error:", error)
    return NextResponse.json({ message: "Password reset failed. Please try again." }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 })
    }

    // Check if token exists and is valid
    const tokenData = resetTokens[token]
    if (!tokenData) {
      return NextResponse.json({ valid: false, message: "Invalid reset token" }, { status: 400 })
    }

    // Check if token has expired
    if (Date.now() > tokenData.expires) {
      delete resetTokens[token] // Clean up expired token
      return NextResponse.json({ valid: false, message: "Reset token has expired" }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      email: tokenData.email,
      message: "Token is valid",
    })
  } catch (error: any) {
    console.error("❌ Token validation error:", error)
    return NextResponse.json({ valid: false, message: "Token validation failed" }, { status: 500 })
  }
}
