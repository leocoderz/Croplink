// Client-side authentication service
class ClientAuthService {
  private baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  async signup(data: { name: string; email: string; phone?: string; password: string }) {
    console.log("🚀 === CLIENT SIGNUP STARTED ===")

    try {
      // Client-side validation
      console.log("🔍 Validating client-side data...")

      if (!data.name || data.name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters long")
      }

      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error("Please enter a valid email address")
      }

      if (!data.password || data.password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      if (data.phone && !/^\+?[\d\s\-()]{10,}$/.test(data.phone.trim())) {
        throw new Error("Please enter a valid phone number")
      }

      console.log("✅ Client-side validation passed")

      // Prepare request data
      const requestData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        password: data.password,
      }

      console.log("📤 Sending signup request to server...")

      const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("📥 Server response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      })

      let result
      try {
        const responseText = await response.text()
        console.log("📝 Raw response:", responseText.substring(0, 100) + "...")

        result = JSON.parse(responseText)
        console.log("📝 Response parsed:", {
          success: result.success,
          hasUser: !!result.user,
          hasToken: !!result.token,
          message: result.message,
        })
      } catch (parseError) {
        console.error("❌ Failed to parse response:", parseError)
        throw new Error("Invalid response from server")
      }

      if (!response.ok) {
        console.error("❌ Server returned error:", {
          status: response.status,
          message: result.message,
        })
        throw new Error(result.message || `Signup failed with status ${response.status}`)
      }

      if (!result.success) {
        console.error("❌ Signup was not successful:", result.message)
        throw new Error(result.message || "Signup failed")
      }

      // Store user data and token for immediate login
      if (result.user && result.token) {
        console.log("💾 Storing user data for auto-login...")
        this.storeUserData(result.user, result.token)
        console.log("✅ User data stored successfully")
      }

      console.log("🎉 Signup completed successfully!")
      return { success: true, ...result }
    } catch (error: any) {
      console.error("💥 CLIENT SIGNUP ERROR:", error.message)
      return {
        success: false,
        message: error.message || "Signup failed. Please try again.",
      }
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      console.log("🔄 Starting login process...")

      // Clear any existing data first
      this.clearUserData()

      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Login failed")
      }

      // Store user data and token
      if (result.user && result.token) {
        this.storeUserData(result.user, result.token)

        // Send login alert SMS if user has phone number
        if (result.user.phone) {
          this.sendLoginAlertSMS(result.user.phone, result.user.name)
        }
      }

      console.log("✅ Login successful")
      return { success: true, ...result }
    } catch (error: any) {
      console.error("❌ Login error:", error)
      return { success: false, message: error.message }
    }
  }

  private storeUserData(user: any, token: string) {
    try {
      localStorage.setItem("agri-app-user", JSON.stringify(user))
      localStorage.setItem("croplink-user", JSON.stringify(user))
      localStorage.setItem("agri-app-token", token)
      localStorage.setItem("croplink-token", token)
      console.log("✅ User data stored in localStorage")
    } catch (error) {
      console.error("❌ Failed to store user data:", error)
    }
  }

  private clearUserData() {
    try {
      localStorage.removeItem("agri-app-user")
      localStorage.removeItem("croplink-user")
      localStorage.removeItem("agri-app-token")
      localStorage.removeItem("croplink-token")
      console.log("✅ User data cleared from localStorage")
    } catch (error) {
      console.error("❌ Failed to clear user data:", error)
    }
  }

  private async sendLoginAlertSMS(phone: string, name: string) {
    try {
      await fetch(`${this.baseUrl}/api/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          message: `Hi ${name}, you've successfully signed in to AgriApp. If this wasn't you, please secure your account immediately.`,
          type: "login_alert",
        }),
      })
    } catch (error) {
      console.error("Failed to send login alert SMS:", error)
    }
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("agri-app-user") || localStorage.getItem("croplink-user")
      const token = localStorage.getItem("agri-app-token") || localStorage.getItem("croplink-token")

      if (userStr && token) {
        return {
          user: JSON.parse(userStr),
          token,
          isAuthenticated: true,
        }
      }

      return {
        user: null,
        token: null,
        isAuthenticated: false,
      }
    } catch (error) {
      console.error("Error getting current user:", error)
      // Clear corrupted data
      this.clearUserData()
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      }
    }
  }

  // Logout user
  logout() {
    this.clearUserData()
    console.log("✅ User logged out from client auth service")
  }
}

export const clientAuthService = new ClientAuthService()
