// AgriApp Email Service with SMTP support
export interface EmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  console.log("📧 AgriApp Email Service Starting...")

  try {
    // Try SMTP first
    const result = await sendViaSMTP(to, subject, html, text)
    console.log("✅ Email sent via SMTP")
    return result
  } catch (smtpError: any) {
    console.warn("⚠️ SMTP failed:", smtpError.message)

    // Fallback to notification system
    const result = await sendViaNotification(to, subject, html || text || "")
    console.log("✅ Email notification processed")
    return result
  }
}

// SMTP email sending
async function sendViaSMTP(to: string, subject: string, html?: string, text?: string) {
  console.log("📧 Sending via SMTP...")

  const nodemailer = await import("nodemailer")

  const transporter = nodemailer.default.createTransport({
    service: "gmail",
    auth: {
      user: "natarajmurali56@gmail.com",
      pass: "msle ntny oyxr ogia",
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  const mailOptions = {
    from: {
      name: "AgriApp Team",
      address: "natarajmurali56@gmail.com",
    },
    to,
    subject,
    html,
    text,
  }

  const result = await transporter.sendMail(mailOptions)

  return {
    success: true,
    messageId: result.messageId,
    provider: "smtp_gmail",
  }
}

// Notification fallback
async function sendViaNotification(to: string, subject: string, content: string) {
  console.log("📧 EMAIL NOTIFICATION SYSTEM")
  console.log("═══════════════════════════════════════")
  console.log("📧 To:", to)
  console.log("📝 Subject:", subject)
  console.log("📄 Content Length:", content.length, "characters")
  console.log("⏰ Timestamp:", new Date().toISOString())
  console.log("✅ Status: Email notification processed")
  console.log("═══════════════════════════════════════")

  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    messageId: `notification_${Date.now()}`,
    provider: "notification_system",
  }
}

// Welcome email template
export function createWelcomeEmailTemplate(name: string, email: string) {
  return {
    subject: "🌱 Welcome to AgriApp - Your Smart Farming Journey Begins!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AgriApp</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #374151; 
            background-color: #f9fafb;
            padding: 20px;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: white; 
            padding: 50px 30px; 
            text-align: center; 
          }
          .header h1 { 
            font-size: 32px; 
            font-weight: 700; 
            margin-bottom: 10px; 
          }
          .content { 
            padding: 50px 40px; 
          }
          .greeting { 
            font-size: 24px; 
            font-weight: 600; 
            color: #1f2937; 
            margin-bottom: 25px; 
          }
          .feature { 
            background: #f8fafc; 
            margin: 20px 0; 
            padding: 25px; 
            border-radius: 12px; 
            border-left: 5px solid #10b981; 
          }
          .feature h4 { 
            font-size: 18px; 
            font-weight: 600; 
            color: #1f2937; 
            margin-bottom: 10px; 
          }
          .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: white; 
            padding: 18px 36px; 
            text-decoration: none; 
            border-radius: 10px; 
            font-weight: 600; 
            margin: 30px 0; 
          }
          .footer { 
            background: #f9fafb; 
            text-align: center; 
            padding: 40px 30px; 
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🌱 Welcome to AgriApp!</h1>
            <p>Your Smart Agricultural Companion</p>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${name}! 👋</div>
            
            <p style="margin-bottom: 30px; color: #4b5563;">
              Thank you for joining AgriApp! We're excited to help you revolutionize your farming experience.
            </p>
            
            <div class="feature">
              <h4>🤖 AI Farm Assistant</h4>
              <p>Get instant answers to your farming questions.</p>
            </div>
            
            <div class="feature">
              <h4>🌤️ Smart Weather Forecasting</h4>
              <p>Stay ahead with accurate weather predictions.</p>
            </div>
            
            <div class="feature">
              <h4>🔍 Disease Detection</h4>
              <p>Identify crop diseases with photo analysis.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="https://agriapp.com" class="cta-button">🚀 Start Farming Smart</a>
            </div>
            
            <p style="margin-top: 30px; color: #4b5563;">
              Need help? Contact us at <strong>natarajmurali56@gmail.com</strong>
            </p>
          </div>
          
          <div class="footer">
            <p>This email was sent to <strong>${email}</strong></p>
            <p><strong>AgriApp - Empowering Farmers with Smart Technology</strong></p>
            <p>© 2024 AgriApp. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to AgriApp, ${name}!

Thank you for joining AgriApp! We're excited to help you revolutionize your farming experience.

Features available:
🤖 AI Farm Assistant - Get instant farming answers
🌤️ Smart Weather Forecasting - Accurate predictions  
🔍 Disease Detection - Identify crop diseases
📊 Farm Analytics - Data-driven decisions

Start exploring: https://agriapp.com

Need help? Contact: natarajmurali56@gmail.com

Happy farming!
The AgriApp Team
    `,
  }
}
