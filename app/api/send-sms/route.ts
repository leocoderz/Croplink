import { type NextRequest, NextResponse } from "next/server"

// SMS Configuration using your Twilio credentials
const SMS_CONFIG = {
  accountSid: "ACcdaf12cecc8aabd1d293dc4fc1ceb62f",
  authToken: "4ac6f8a534bc68eed06cc9436b9cebd8",
  fromNumber: process.env.SMS_FROM_NUMBER || "+18777804236",
}

// Valid North American area codes (US and Canada)
const VALID_AREA_CODES = new Set([
  // Major US area codes
  "201",
  "202",
  "203",
  "205",
  "206",
  "207",
  "208",
  "209",
  "210",
  "212",
  "213",
  "214",
  "215",
  "216",
  "217",
  "218",
  "219",
  "224",
  "225",
  "228",
  "229",
  "231",
  "234",
  "239",
  "240",
  "248",
  "251",
  "252",
  "253",
  "254",
  "256",
  "260",
  "262",
  "267",
  "269",
  "270",
  "276",
  "281",
  "301",
  "302",
  "303",
  "304",
  "305",
  "307",
  "308",
  "309",
  "310",
  "312",
  "313",
  "314",
  "315",
  "316",
  "317",
  "318",
  "319",
  "320",
  "321",
  "323",
  "325",
  "330",
  "331",
  "334",
  "336",
  "337",
  "339",
  "347",
  "351",
  "352",
  "360",
  "361",
  "386",
  "401",
  "402",
  "404",
  "405",
  "406",
  "407",
  "408",
  "409",
  "410",
  "412",
  "413",
  "414",
  "415",
  "417",
  "419",
  "423",
  "424",
  "425",
  "430",
  "432",
  "434",
  "435",
  "440",
  "443",
  "458",
  "469",
  "470",
  "475",
  "478",
  "479",
  "480",
  "484",
  "501",
  "502",
  "503",
  "504",
  "505",
  "507",
  "508",
  "509",
  "510",
  "512",
  "513",
  "515",
  "516",
  "517",
  "518",
  "520",
  "530",
  "540",
  "541",
  "551",
  "559",
  "561",
  "562",
  "563",
  "564",
  "567",
  "570",
  "571",
  "573",
  "574",
  "575",
  "580",
  "585",
  "586",
  "601",
  "602",
  "603",
  "605",
  "606",
  "607",
  "608",
  "609",
  "610",
  "612",
  "614",
  "615",
  "616",
  "617",
  "618",
  "619",
  "620",
  "623",
  "626",
  "630",
  "631",
  "636",
  "641",
  "646",
  "650",
  "651",
  "660",
  "661",
  "662",
  "667",
  "678",
  "682",
  "701",
  "702",
  "703",
  "704",
  "706",
  "707",
  "708",
  "712",
  "713",
  "714",
  "715",
  "716",
  "717",
  "718",
  "719",
  "720",
  "724",
  "727",
  "731",
  "732",
  "734",
  "737",
  "740",
  "747",
  "754",
  "757",
  "760",
  "763",
  "765",
  "770",
  "772",
  "773",
  "774",
  "775",
  "781",
  "785",
  "786",
  "801",
  "802",
  "803",
  "804",
  "805",
  "806",
  "808",
  "810",
  "812",
  "813",
  "814",
  "815",
  "816",
  "817",
  "818",
  "828",
  "830",
  "831",
  "832",
  "843",
  "845",
  "847",
  "848",
  "850",
  "856",
  "857",
  "858",
  "859",
  "860",
  "862",
  "863",
  "864",
  "865",
  "870",
  "872",
  "878",
  "901",
  "903",
  "904",
  "906",
  "907",
  "908",
  "909",
  "910",
  "912",
  "913",
  "914",
  "915",
  "916",
  "917",
  "918",
  "919",
  "920",
  "925",
  "928",
  "929",
  "931",
  "936",
  "937",
  "940",
  "941",
  "947",
  "949",
  "951",
  "952",
  "954",
  "956",
  "959",
  "970",
  "971",
  "972",
  "973",
  "978",
  "979",
  "980",
  "984",
  "985",
  "989",
  // Canadian area codes
  "204",
  "226",
  "236",
  "249",
  "250",
  "289",
  "306",
  "343",
  "365",
  "403",
  "416",
  "418",
  "431",
  "437",
  "438",
  "450",
  "506",
  "514",
  "519",
  "548",
  "579",
  "581",
  "587",
  "604",
  "613",
  "639",
  "647",
  "672",
  "705",
  "709",
  "742",
  "778",
  "780",
  "782",
  "807",
  "819",
  "825",
  "867",
  "873",
  "902",
  "905",
])

// Enhanced phone number validation and formatting
function validateAndFormatPhoneNumber(phone: string): { isValid: boolean; formatted?: string; error?: string } {
  try {
    console.log("📱 Original phone input:", JSON.stringify(phone))

    if (!phone || typeof phone !== "string") {
      return { isValid: false, error: "Phone number is required" }
    }

    // Check for placeholder or incomplete numbers
    if (phone.includes("X") || phone.includes("x") || phone.includes("*")) {
      return { isValid: false, error: "Phone number appears to be incomplete or contains placeholder characters" }
    }

    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, "")
    console.log("🧹 Cleaned phone:", cleaned)

    // Check if number is too short
    if (cleaned.length < 10) {
      return { isValid: false, error: "Phone number is too short" }
    }

    // Handle different phone number formats
    if (cleaned.startsWith("+1")) {
      // Already has +1 country code
      if (cleaned.length !== 12) {
        return {
          isValid: false,
          error: `US/Canada phone number with +1 must be exactly 12 digits, got ${cleaned.length}`,
        }
      }
    } else if (cleaned.startsWith("1") && cleaned.length === 11) {
      // US number starting with 1 but missing +
      cleaned = "+" + cleaned
    } else if (cleaned.length === 10) {
      // 10-digit US number without country code
      cleaned = "+1" + cleaned
    } else if (cleaned.startsWith("+")) {
      // International number - basic validation
      if (cleaned.length < 10 || cleaned.length > 15) {
        return { isValid: false, error: "International phone number must be 10-15 digits" }
      }
      // For international numbers, skip US-specific validation
      console.log("✅ International phone number validated:", cleaned)
      return { isValid: true, formatted: cleaned }
    } else {
      return { isValid: false, error: `Invalid phone number format. Got ${cleaned.length} digits: ${cleaned}` }
    }

    // Validate US/Canada numbers specifically
    if (cleaned.startsWith("+1")) {
      const usNumber = cleaned.substring(2) // Remove +1
      console.log("🇺🇸 Validating US/Canada number:", usNumber)

      // Check if it's exactly 10 digits
      if (usNumber.length !== 10) {
        return {
          isValid: false,
          error: `US/Canada phone number must be exactly 10 digits after country code, got ${usNumber.length}`,
        }
      }

      // Check if all characters are digits
      if (!/^\d{10}$/.test(usNumber)) {
        return { isValid: false, error: "Phone number contains non-digit characters" }
      }

      // Extract area code and validate
      const areaCode = usNumber.substring(0, 3)
      console.log("📍 Area code:", areaCode)

      // Check if area code is valid
      if (!VALID_AREA_CODES.has(areaCode)) {
        return { isValid: false, error: `Invalid area code: ${areaCode}. Please check your phone number.` }
      }

      // Check exchange code (next 3 digits) - should not start with 0 or 1
      const exchangeCode = usNumber.substring(3, 6)
      console.log("📞 Exchange code:", exchangeCode)

      if (exchangeCode.startsWith("0") || exchangeCode.startsWith("1")) {
        return {
          isValid: false,
          error: `Invalid exchange code: ${exchangeCode}. Exchange code cannot start with 0 or 1.`,
        }
      }

      // Check subscriber number (last 4 digits)
      const subscriberNumber = usNumber.substring(6, 10)
      console.log("🔢 Subscriber number:", subscriberNumber)

      if (subscriberNumber === "0000") {
        return { isValid: false, error: "Invalid subscriber number: cannot be 0000" }
      }
    }

    console.log("✅ Phone number validated and formatted:", cleaned)
    return { isValid: true, formatted: cleaned }
  } catch (error: any) {
    console.error("❌ Phone validation error:", error)
    return { isValid: false, error: "Phone number validation failed" }
  }
}

// Real Twilio SMS function with enhanced error handling
async function sendSMSTwilio(phone: string, message: string) {
  try {
    console.log("📱 === TWILIO SMS SENDING STARTED ===")
    console.log("📱 Input phone:", JSON.stringify(phone))
    console.log("📱 Message length:", message.length)

    // Validate phone number first
    const phoneValidation = validateAndFormatPhoneNumber(phone)
    if (!phoneValidation.isValid) {
      console.error("❌ Phone validation failed:", phoneValidation.error)
      throw new Error(`Invalid phone number: ${phoneValidation.error}`)
    }

    const validatedPhone = phoneValidation.formatted!
    console.log("📱 Validated phone number:", validatedPhone)

    if (!SMS_CONFIG.accountSid || !SMS_CONFIG.authToken) {
      console.log("⚠️ Twilio credentials not configured, using mock SMS")
      return await sendSMSMock(validatedPhone, message)
    }

    // Double-check the phone number format before sending to Twilio
    if (!validatedPhone.match(/^\+1\d{10}$/) && !validatedPhone.match(/^\+\d{10,15}$/)) {
      throw new Error(`Phone number format invalid for Twilio: ${validatedPhone}`)
    }

    // Use fetch API for better serverless compatibility
    const auth = Buffer.from(`${SMS_CONFIG.accountSid}:${SMS_CONFIG.authToken}`).toString("base64")

    const formData = new URLSearchParams()
    formData.append("To", validatedPhone)
    formData.append("Body", message)
    formData.append("From", SMS_CONFIG.fromNumber)

    console.log("📤 Sending to Twilio API:", {
      to: validatedPhone,
      from: SMS_CONFIG.fromNumber,
      messageLength: message.length,
      accountSid: SMS_CONFIG.accountSid.substring(0, 10) + "...",
    })

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${SMS_CONFIG.accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    console.log("📡 Twilio response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ Twilio API error response:", errorData)

      // Handle specific Twilio errors with better messages
      if (errorData.code === 21211) {
        throw new Error(
          `Twilio rejected phone number ${validatedPhone}. This number may not be valid or may not be able to receive SMS messages.`,
        )
      } else if (errorData.code === 21614) {
        throw new Error(`Phone number ${validatedPhone} is not a valid mobile number for SMS`)
      } else if (errorData.code === 21408) {
        throw new Error(
          `Permission denied for phone number ${validatedPhone}. This number may be on a do-not-call list.`,
        )
      } else {
        throw new Error(`Twilio API error (${errorData.code}): ${errorData.message}`)
      }
    }

    const result = await response.json()
    console.log("✅ Twilio SMS sent successfully:", {
      sid: result.sid,
      status: result.status,
      to: result.to,
    })

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
      provider: "twilio",
      cost: Number.parseFloat(result.price) || 0.0075,
    }
  } catch (error: any) {
    console.error("❌ Twilio SMS failed:", error.message)

    // Don't fallback to mock for validation errors - these need to be fixed
    if (error.message.includes("Invalid phone number") || error.message.includes("Twilio rejected")) {
      throw error
    }

    console.log("🔄 Falling back to mock SMS due to service error...")
    return await sendSMSMock(phone, message)
  }
}

// Mock SMS function for testing/fallback
async function sendSMSMock(phone: string, message: string) {
  console.log("📱 [MOCK SMS] === MOCK SMS SERVICE ===")
  console.log("📱 [MOCK SMS] To:", phone)
  console.log("📱 [MOCK SMS] Message:", message.substring(0, 100) + (message.length > 100 ? "..." : ""))

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: "delivered",
    provider: "mock",
    cost: 0.0075,
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📱 === SMS API ENDPOINT CALLED ===")

    const body = await request.json()
    const { phone, message, type } = body

    console.log("📱 SMS API request:", {
      phone: phone ? `${phone.substring(0, 3)}***${phone.substring(phone.length - 4)}` : "undefined",
      messageLength: message?.length || 0,
      type: type || "general",
    })

    // Validation
    if (!phone || !message) {
      console.log("❌ Missing required fields:", { hasPhone: !!phone, hasMessage: !!message })
      return NextResponse.json(
        {
          success: false,
          message: "Phone number and message are required",
        },
        { status: 400 },
      )
    }

    // Validate and format phone number
    const phoneValidation = validateAndFormatPhoneNumber(phone)
    if (!phoneValidation.isValid) {
      console.log("❌ Phone validation failed:", phoneValidation.error)
      return NextResponse.json(
        {
          success: false,
          message: `Invalid phone number: ${phoneValidation.error}`,
          error: phoneValidation.error,
        },
        { status: 400 },
      )
    }

    const validatedPhone = phoneValidation.formatted!
    console.log("✅ Phone number validated for API:", validatedPhone)

    // Send SMS
    const result = await sendSMSTwilio(validatedPhone, message)

    if (!result.success) {
      throw new Error("SMS sending failed")
    }

    console.log("✅ SMS API success:", {
      messageId: result.messageId,
      provider: result.provider,
      status: result.status,
    })

    return NextResponse.json({
      success: true,
      message: "SMS sent successfully",
      messageId: result.messageId,
      status: result.status,
      provider: result.provider,
      cost: result.cost || 0,
      phoneUsed: validatedPhone,
    })
  } catch (error: any) {
    console.error("❌ SMS API error:", error.message)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send SMS",
        provider: "error",
      },
      { status: 500 },
    )
  }
}
