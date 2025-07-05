// SMS Service for sending text notifications
class SMSService {
  private baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  async sendWelcomeSMS(phone: string, name: string) {
    try {
      console.log("📱 Sending welcome SMS to:", phone)

      const response = await fetch(`${this.baseUrl}/api/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          message: `Welcome to AgriApp, ${name}! 🌱 Your account has been created successfully. Start exploring smart farming solutions today. Download the app: ${this.baseUrl}`,
          type: "welcome",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to send SMS")
      }

      console.log("✅ Welcome SMS sent successfully")
      return { success: true, ...result }
    } catch (error: any) {
      console.error("❌ SMS sending failed:", error)
      return { success: false, message: error.message }
    }
  }

  async sendPasswordResetSMS(phone: string, name: string) {
    try {
      console.log("📱 Sending password reset SMS to:", phone)

      const response = await fetch(`${this.baseUrl}/api/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          message: `Hi ${name}, your AgriApp password has been reset successfully. If you didn't make this change, please contact support immediately.`,
          type: "password_reset",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to send SMS")
      }

      console.log("✅ Password reset SMS sent successfully")
      return { success: true, ...result }
    } catch (error: any) {
      console.error("❌ SMS sending failed:", error)
      return { success: false, message: error.message }
    }
  }

  async sendLoginAlertSMS(phone: string, name: string) {
    try {
      console.log("📱 Sending login alert SMS to:", phone)

      const response = await fetch(`${this.baseUrl}/api/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          message: `Hi ${name}, you've successfully signed in to AgriApp. If this wasn't you, please secure your account immediately.`,
          type: "login_alert",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to send SMS")
      }

      console.log("✅ Login alert SMS sent successfully")
      return { success: true, ...result }
    } catch (error: any) {
      console.error("❌ SMS sending failed:", error)
      return { success: false, message: error.message }
    }
  }
}

export const smsService = new SMSService()
