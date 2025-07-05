// Comprehensive Email Notification Service for AgriApp
export interface EmailNotificationOptions {
  to: string
  name?: string
  type:
    | "welcome"
    | "login_alert"
    | "password_reset"
    | "weather_alert"
    | "disease_alert"
    | "scheme_notification"
    | "activity_summary"
  data?: any
}

export class EmailNotificationService {
  private apiKey = "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"
  private senderEmail = "natarajaiml@gmail.com"
  private senderName = "AgriApp Team"

  async sendNotification({ to, name = "Farmer", type, data = {} }: EmailNotificationOptions) {
    try {
      console.log(`📧 Sending ${type} notification to:`, to)

      const emailContent = this.getEmailContent(type, name, to, data)

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: this.senderName,
            email: this.senderEmail,
          },
          to: [
            {
              email: to,
              name: name,
            },
          ],
          subject: emailContent.subject,
          htmlContent: emailContent.html,
          textContent: emailContent.text,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`✅ ${type} email sent successfully:`, result.messageId)
        return {
          success: true,
          messageId: result.messageId,
          type,
          recipient: to,
        }
      } else {
        const errorData = await response.text()
        console.error(`❌ ${type} email failed:`, response.status, errorData)
        throw new Error(`Email delivery failed: ${response.status}`)
      }
    } catch (error: any) {
      console.error(`❌ ${type} notification error:`, error.message)
      return {
        success: false,
        error: error.message,
        type,
        recipient: to,
      }
    }
  }

  private getEmailContent(type: string, name: string, email: string, data: any) {
    switch (type) {
      case "welcome":
        return this.getWelcomeEmail(name, email)
      case "login_alert":
        return this.getLoginAlertEmail(name, email, data)
      case "password_reset":
        return this.getPasswordResetEmail(name, email, data)
      case "weather_alert":
        return this.getWeatherAlertEmail(name, email, data)
      case "disease_alert":
        return this.getDiseaseAlertEmail(name, email, data)
      case "scheme_notification":
        return this.getSchemeNotificationEmail(name, email, data)
      case "activity_summary":
        return this.getActivitySummaryEmail(name, email, data)
      default:
        return this.getGenericEmail(name, email, data)
    }
  }

  private getWelcomeEmail(name: string, email: string) {
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
              padding: 40px 30px; 
              text-align: center; 
            }
            .header h1 { 
              font-size: 28px; 
              font-weight: 700; 
              margin-bottom: 10px; 
            }
            .content { 
              padding: 40px 30px; 
            }
            .greeting { 
              font-size: 22px; 
              font-weight: 600; 
              color: #1f2937; 
              margin-bottom: 20px; 
            }
            .feature { 
              background: #f8fafc; 
              margin: 15px 0; 
              padding: 20px; 
              border-radius: 8px; 
              border-left: 4px solid #10b981; 
            }
            .feature h4 { 
              font-size: 16px; 
              font-weight: 600; 
              color: #1f2937; 
              margin-bottom: 8px; 
            }
            .cta-button { 
              display: inline-block; 
              background: #10b981; 
              color: white; 
              padding: 15px 30px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600; 
              margin: 20px 0; 
            }
            .footer { 
              background: #f9fafb; 
              text-align: center; 
              padding: 30px; 
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
              
              <p style="margin-bottom: 25px; color: #4b5563;">
                Thank you for joining AgriApp! We're excited to help you revolutionize your farming experience with AI-powered insights and smart technology.
              </p>
              
              <div class="feature">
                <h4>🤖 AI Farm Assistant</h4>
                <p>Get instant answers to your farming questions with our intelligent assistant.</p>
              </div>
              
              <div class="feature">
                <h4>🌤️ Smart Weather Forecasting</h4>
                <p>Stay ahead with accurate weather predictions tailored to your location.</p>
              </div>
              
              <div class="feature">
                <h4>🔍 Disease Detection</h4>
                <p>Upload crop photos for instant AI-powered disease identification.</p>
              </div>
              
              <div class="feature">
                <h4>📊 Farm Analytics</h4>
                <p>Make data-driven decisions with comprehensive farm insights.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="https://agriapp.com" class="cta-button">🚀 Start Farming Smart</a>
              </div>
              
              <p style="margin-top: 25px; color: #4b5563;">
                Need help getting started? Reply to this email or contact us at <strong>natarajmurali56@gmail.com</strong>
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

🚀 Your AgriApp Features:
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

  private getLoginAlertEmail(name: string, email: string, data: any) {
    const loginTime = new Date().toLocaleString()
    const location = data.location || "Unknown location"
    const device = data.device || "Unknown device"

    return {
      subject: "🔐 AgriApp Login Alert - Account Access Notification",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .alert-box { background: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Login Alert</h1>
              <p>AgriApp Account Security</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>We detected a successful login to your AgriApp account:</p>
              
              <div class="alert-box">
                <strong>📅 Time:</strong> ${loginTime}<br>
                <strong>📍 Location:</strong> ${location}<br>
                <strong>💻 Device:</strong> ${device}
              </div>
              
              <p><strong>If this was you:</strong> No action needed. You're all set!</p>
              
              <p><strong>If this wasn't you:</strong> Please secure your account immediately by:</p>
              <ul>
                <li>Changing your password</li>
                <li>Reviewing your account activity</li>
                <li>Contacting our support team</li>
              </ul>
              
              <p>Need help? Contact us at <strong>natarajmurali56@gmail.com</strong></p>
            </div>
            
            <div class="footer">
              <p>This alert was sent to <strong>${email}</strong></p>
              <p><strong>AgriApp Security Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Login Alert - AgriApp

Hello ${name}!

We detected a successful login to your AgriApp account:

Time: ${loginTime}
Location: ${location}
Device: ${device}

If this was you: No action needed.
If this wasn't you: Please secure your account immediately.

Need help? Contact: natarajmurali56@gmail.com

AgriApp Security Team
      `,
    }
  }

  private getWeatherAlertEmail(name: string, email: string, data: any) {
    const alertType = data.alertType || "Weather Alert"
    const message = data.message || "Important weather update for your area"
    const temperature = data.temperature || "N/A"
    const conditions = data.conditions || "Check your app for details"

    return {
      subject: `🌤️ ${alertType} - AgriApp Weather Alert`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .weather-box { background: #fef3cd; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌤️ Weather Alert</h1>
              <p>AgriApp Weather Service</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>${message}</p>
              
              <div class="weather-box">
                <h3>📊 Current Conditions:</h3>
                <p><strong>🌡️ Temperature:</strong> ${temperature}</p>
                <p><strong>☁️ Conditions:</strong> ${conditions}</p>
              </div>
              
              <p><strong>💡 Farming Tips:</strong></p>
              <ul>
                <li>Check your crops for weather-related stress</li>
                <li>Adjust irrigation schedules if needed</li>
                <li>Protect sensitive plants if severe weather expected</li>
                <li>Monitor soil moisture levels</li>
              </ul>
              
              <p>Stay safe and keep farming smart! 🚜</p>
            </div>
            
            <div class="footer">
              <p>Weather alerts sent to <strong>${email}</strong></p>
              <p><strong>AgriApp Weather Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Weather Alert - AgriApp

Hello ${name}!

${message}

Current Conditions:
Temperature: ${temperature}
Conditions: ${conditions}

Farming Tips:
- Check crops for weather stress
- Adjust irrigation if needed
- Protect sensitive plants
- Monitor soil moisture

Stay safe and keep farming smart!

AgriApp Weather Team
      `,
    }
  }

  private getDiseaseAlertEmail(name: string, email: string, data: any) {
    const cropName = data.cropName || "your crop"
    const diseaseName = data.diseaseName || "potential disease"
    const severity = data.severity || "moderate"
    const treatment = data.treatment || "Consult agricultural expert"

    return {
      subject: `🔍 Disease Alert: ${diseaseName} detected in ${cropName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .alert-box { background: #fef2f2; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .treatment-box { background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔍 Disease Alert</h1>
              <p>AgriApp Disease Detection</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>Our AI system has detected a potential disease in your crop:</p>
              
              <div class="alert-box">
                <h3>🚨 Detection Results:</h3>
                <p><strong>🌱 Crop:</strong> ${cropName}</p>
                <p><strong>🦠 Disease:</strong> ${diseaseName}</p>
                <p><strong>⚠️ Severity:</strong> ${severity}</p>
              </div>
              
              <div class="treatment-box">
                <h3>💊 Recommended Treatment:</h3>
                <p>${treatment}</p>
              </div>
              
              <p><strong>🎯 Next Steps:</strong></p>
              <ul>
                <li>Inspect affected plants immediately</li>
                <li>Isolate infected areas if possible</li>
                <li>Apply recommended treatment</li>
                <li>Monitor crop health daily</li>
                <li>Contact local agricultural extension if needed</li>
              </ul>
              
              <p>Early detection saves crops! Act quickly for best results. 🌱</p>
            </div>
            
            <div class="footer">
              <p>Disease alerts sent to <strong>${email}</strong></p>
              <p><strong>AgriApp Disease Detection Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Disease Alert - AgriApp

Hello ${name}!

Our AI detected a potential disease in your crop:

Detection Results:
Crop: ${cropName}
Disease: ${diseaseName}
Severity: ${severity}

Recommended Treatment:
${treatment}

Next Steps:
- Inspect affected plants immediately
- Isolate infected areas if possible
- Apply recommended treatment
- Monitor crop health daily

Early detection saves crops! Act quickly.

AgriApp Disease Detection Team
      `,
    }
  }

  private getSchemeNotificationEmail(name: string, email: string, data: any) {
    const schemeName = data.schemeName || "New Government Scheme"
    const description = data.description || "A new agricultural scheme is available"
    const deadline = data.deadline || "Check details for deadline"
    const eligibility = data.eligibility || "Check eligibility criteria"

    return {
      subject: `🏛️ New Scheme Alert: ${schemeName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .scheme-box { background: #f3f4f6; border: 1px solid #d1d5db; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .cta-button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏛️ Government Scheme Alert</h1>
              <p>AgriApp Scheme Notification</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>A new government scheme that might benefit your farming operations is now available:</p>
              
              <div class="scheme-box">
                <h3>📋 Scheme Details:</h3>
                <p><strong>🏛️ Scheme Name:</strong> ${schemeName}</p>
                <p><strong>📝 Description:</strong> ${description}</p>
                <p><strong>⏰ Deadline:</strong> ${deadline}</p>
                <p><strong>✅ Eligibility:</strong> ${eligibility}</p>
              </div>
              
              <div style="text-align: center;">
                <a href="https://agriapp.com/schemes" class="cta-button">📋 View Full Details</a>
              </div>
              
              <p><strong>💡 Application Tips:</strong></p>
              <ul>
                <li>Read all eligibility criteria carefully</li>
                <li>Gather required documents early</li>
                <li>Apply before the deadline</li>
                <li>Keep copies of all submissions</li>
              </ul>
              
              <p>Don't miss out on this opportunity to grow your farming business! 🚜</p>
            </div>
            
            <div class="footer">
              <p>Scheme notifications sent to <strong>${email}</strong></p>
              <p><strong>AgriApp Government Schemes Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Government Scheme Alert - AgriApp

Hello ${name}!

A new government scheme is available:

Scheme Details:
Name: ${schemeName}
Description: ${description}
Deadline: ${deadline}
Eligibility: ${eligibility}

Application Tips:
- Read eligibility criteria carefully
- Gather required documents early
- Apply before deadline
- Keep copies of submissions

View details: https://agriapp.com/schemes

AgriApp Government Schemes Team
      `,
    }
  }

  private getActivitySummaryEmail(name: string, email: string, data: any) {
    const period = data.period || "this week"
    const diseaseScans = data.diseaseScans || 0
    const weatherChecks = data.weatherChecks || 0
    const aiQuestions = data.aiQuestions || 0
    const schemesViewed = data.schemesViewed || 0

    return {
      subject: `📊 Your AgriApp Activity Summary - ${period}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center; }
            .stat-number { font-size: 24px; font-weight: bold; color: #059669; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Activity Summary</h1>
              <p>Your AgriApp Usage Report</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>Here's a summary of your AgriApp activity ${period}:</p>
              
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-number">${diseaseScans}</div>
                  <div>🔍 Disease Scans</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${weatherChecks}</div>
                  <div>🌤️ Weather Checks</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${aiQuestions}</div>
                  <div>🤖 AI Questions</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${schemesViewed}</div>
                  <div>🏛️ Schemes Viewed</div>
                </div>
              </div>
              
              <p><strong>🎯 Keep Up the Great Work!</strong></p>
              <p>You're making smart use of AgriApp's features to improve your farming operations.</p>
              
              <p><strong>💡 Suggestions for next week:</strong></p>
              <ul>
                <li>Try the crop analytics feature</li>
                <li>Set up weather alerts for your location</li>
                <li>Explore new government schemes</li>
                <li>Ask the AI assistant about seasonal farming tips</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Activity summary sent to <strong>${email}</strong></p>
              <p><strong>AgriApp Analytics Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Activity Summary - AgriApp

Hello ${name}!

Your AgriApp activity ${period}:

📊 Your Stats:
🔍 Disease Scans: ${diseaseScans}
🌤️ Weather Checks: ${weatherChecks}
🤖 AI Questions: ${aiQuestions}
🏛️ Schemes Viewed: ${schemesViewed}

Keep up the great work!

Suggestions for next week:
- Try crop analytics
- Set up weather alerts
- Explore new schemes
- Ask AI for seasonal tips

AgriApp Analytics Team
      `,
    }
  }

  private getGenericEmail(name: string, email: string, data: any) {
    const subject = data.subject || "AgriApp Notification"
    const message = data.message || "You have a new notification from AgriApp"

    return {
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 AgriApp Notification</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>${message}</p>
              <p>Thank you for using AgriApp to enhance your farming operations.</p>
            </div>
            
            <div class="footer">
              <p>Notification sent to <strong>${email}</strong></p>
              <p><strong>AgriApp Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
${subject}

Hello ${name}!

${message}

Thank you for using AgriApp.

AgriApp Team
      `,
    }
  }
}

// Export singleton instance
export const emailNotificationService = new EmailNotificationService()
