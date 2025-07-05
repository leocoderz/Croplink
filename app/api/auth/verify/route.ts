import { type NextRequest, NextResponse } from "next/server"

async function verifyToken(token: string): Promise<any> {
  const jwt = await import("jsonwebtoken")
  const secret = process.env.JWT_SECRET || "fallback-secret-key"

  return jwt.default.verify(token, secret)
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ valid: false, message: "No token provided" }, { status: 400 })
    }

    try {
      const decoded = await verifyToken(token)

      return NextResponse.json({
        valid: true,
        user: {
          userId: decoded.userId,
          email: decoded.email,
          name: decoded.name,
          provider: decoded.provider,
        },
      })
    } catch (jwtError) {
      return NextResponse.json({ valid: false, message: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error: any) {
    console.error("Token verification error:", error)
    return NextResponse.json({ valid: false, message: "Token verification failed" }, { status: 500 })
  }
}
