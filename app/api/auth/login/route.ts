import { type NextRequest, NextResponse } from "next/server"
import { UserStorage } from "@/lib/user-storage"

// Dynamic imports to avoid bundling issues
async function comparePassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import("bcryptjs")
  return bcrypt.default.compare(password, hash)
}

async function generateToken(payload: any): Promise<string> {
  try {
    // Create a simple token without JWT for consistency
    const tokenData = {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      timestamp: Date.now(),
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }

    // Base64 encode the token data
    const token = Buffer.from(JSON.stringify(tokenData)).toString("base64")
    return token
  } catch (error: any) {
    console.error("❌ Token generation failed:", error)
    // Return a basic token as fallback
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export async function POST(request: NextRequest) {
  console.log("🚀 === LOGIN API CALLED ===")

  try {
    const { email, password } = await request.json()

    console.log("📋 Login attempt for:", email || "MISSING EMAIL")

    // Validate required fields
    if (!email || !password) {
      console.log("❌ Missing email or password")
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format")
      return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 })
    }

    // Debug: Log current users in storage
    console.log("🔍 Checking user storage...")
    UserStorage.debugLogUsers()

    // Find user by email using shared storage
    const user = UserStorage.findUserByEmail(email)
    if (!user) {
      console.log("❌ User not found for email:", email)
      return NextResponse.json(
        { message: "No account found with this email address. Please check your email or sign up." },
        { status: 401 },
      )
    }

    console.log("✅ User found:", { id: user.id, email: user.email, name: user.name })

    // Check if account is active
    if (!user.isActive) {
      console.log("❌ Account is inactive")
      return NextResponse.json(
        { message: "Your account has been deactivated. Please contact support for assistance." },
        { status: 403 },
      )
    }

    // Verify password
    console.log("🔐 Verifying password...")
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      console.log("❌ Invalid password")
      return NextResponse.json({ message: "Incorrect password. Please try again." }, { status: 401 })
    }

    console.log("✅ Password verified successfully")

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    })

    // Update last login timestamp using shared storage
    UserStorage.updateUser(user.id, {
      lastLogin: new Date().toISOString(),
    })

    // Get updated user data
    const updatedUser = UserStorage.findUserById(user.id)!

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = updatedUser

    console.log("✅ User logged in successfully:", {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      timestamp: updatedUser.lastLogin,
    })

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${updatedUser.name}!`,
      user: userWithoutPassword,
      token,
    })
  } catch (error: any) {
    console.error("❌ Login error:", error)

    return NextResponse.json(
      {
        message: "We're experiencing technical difficulties. Please try again in a moment.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
