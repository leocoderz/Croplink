import { type NextRequest, NextResponse } from "next/server"
import { UserStorage } from "@/lib/user-storage"

// Dynamic imports to avoid bundling issues
async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs")
  const saltRounds = 12
  return bcrypt.default.hash(password, saltRounds)
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

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to safely send SMS without blocking signup
async function sendWelcomeSMS(phone: string, name: string, baseUrl: string) {
  try {
    console.log("📱 Attempting to send welcome SMS to:", phone)

    const smsPayload = {
      phone: phone,
      message: `🌾 Welcome to AgriApp, ${name}! Your account has been created successfully. Start exploring smart farming solutions today!`,
      type: "welcome",
    }

    console.log("📤 SMS payload:", smsPayload)

    const response = await fetch(`${baseUrl}/api/send-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(smsPayload),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Welcome SMS sent successfully:", result)
      return { success: true, message: "SMS sent successfully" }
    } else {
      const errorText = await response.text()
      console.log("⚠️ SMS API returned error:", response.status, errorText)
      return { success: false, message: `SMS API error: ${response.status}` }
    }
  } catch (error: any) {
    console.error("❌ SMS sending failed (non-blocking):", error.message)
    return { success: false, message: error.message }
  }
}

// Helper function to safely send welcome email without blocking signup
async function sendWelcomeEmail(email: string, name: string, baseUrl: string) {
  try {
    console.log("📧 Attempting to send welcome email to:", email)

    const emailPayload = {
      email: email,
      name: name,
      subject: "Welcome to AgriApp!",
    }

    const response = await fetch(`${baseUrl}/api/send-welcome-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Welcome email sent successfully:", result)
      return { success: true, message: "Email sent successfully" }
    } else {
      const errorText = await response.text()
      console.log("⚠️ Email API returned error:", response.status, errorText)
      return { success: false, message: `Email API error: ${response.status}` }
    }
  } catch (error: any) {
    console.error("❌ Email sending failed (non-blocking):", error.message)
    return { success: false, message: error.message }
  }
}

export async function POST(request: NextRequest) {
  console.log("🚀 === SIGNUP API CALLED ===")

  try {
    const { name, email, phone, password } = await request.json()

    console.log("📋 Signup attempt:", { name, email, phone: phone ? "PROVIDED" : "MISSING" })

    // Validate required fields
    if (!name || !email || !password) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate name
    if (name.trim().length < 2) {
      console.log("❌ Name too short")
      return NextResponse.json({ message: "Name must be at least 2 characters long" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format")
      return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 })
    }

    // Validate phone if provided
    if (phone && !/^\+?[\d\s\-()]{10,}$/.test(phone)) {
      console.log("❌ Invalid phone format")
      return NextResponse.json({ message: "Please enter a valid phone number" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      console.log("❌ Password too short")
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      console.log("❌ Password not strong enough")
      return NextResponse.json(
        { message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" },
        { status: 400 },
      )
    }

    // Debug: Log current users in storage before checking
    console.log("🔍 Checking existing users before signup...")
    UserStorage.debugLogUsers()

    // Check if user already exists using shared storage
    const existingUser = UserStorage.findUserByEmail(email)
    if (existingUser) {
      console.log("❌ User already exists:", email)
      return NextResponse.json(
        { message: "An account with this email address already exists. Please sign in instead." },
        { status: 409 },
      )
    }

    console.log("✅ Email is available, proceeding with signup...")

    // Hash password
    console.log("🔐 Hashing password...")
    const hashedPassword = await hashPassword(password)

    // Create user object
    const userId = generateUserId()
    const newUser = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || "",
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      provider: "email",
    }

    console.log("👤 Creating new user:", { id: newUser.id, name: newUser.name, email: newUser.email })

    // Add user to shared storage
    UserStorage.addUser(newUser)

    // Debug: Log users after adding
    console.log("📊 Users after signup:")
    UserStorage.debugLogUsers()

    // Generate JWT token
    const token = await generateToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    })

    // Get base URL for API calls
    const baseUrl = request.nextUrl.origin

    // Send notifications asynchronously (don't wait for them)
    const notifications = []

    // Send welcome SMS if phone number provided
    if (phone && phone.trim()) {
      notifications.push(
        sendWelcomeSMS(phone.trim(), name, baseUrl)
          .then((result) => {
            console.log("📱 SMS result:", result)
          })
          .catch((error) => {
            console.error("📱 SMS error (ignored):", error.message)
          }),
      )
    }

    // Send welcome email
    notifications.push(
      sendWelcomeEmail(newUser.email, newUser.name, baseUrl)
        .then((result) => {
          console.log("📧 Email result:", result)
        })
        .catch((error) => {
          console.error("📧 Email error (ignored):", error.message)
        }),
    )

    // Don't wait for notifications - let them run in background
    Promise.allSettled(notifications).then((results) => {
      console.log("📬 All notifications processed:", results.length)
    })

    // Return user data immediately (without password)
    const { password: _, ...userWithoutPassword } = newUser

    console.log("🎉 User signup completed successfully:", {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      totalUsers: UserStorage.getUserCount(),
    })

    return NextResponse.json({
      success: true,
      message: `Welcome to AgriApp, ${newUser.name}! Your account has been created successfully.`,
      user: userWithoutPassword,
      token,
    })
  } catch (error: any) {
    console.error("❌ Signup error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "We're experiencing technical difficulties. Please try again in a moment.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
