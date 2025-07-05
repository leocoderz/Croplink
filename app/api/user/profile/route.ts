import { type NextRequest, NextResponse } from "next/server"

/**
 * NOTE:
 * The full user-profile API relies on server-side libraries (Neon + JWT) that
 * aren’t supported in the next-lite preview runtime.  To keep the client app
 * compiling and loading, we provide a minimal placeholder route instead.
 */

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: "User-profile API is disabled in this preview build. Deploy to a full Next.js runtime to enable it.",
    },
    { status: 501 },
  )
}

export async function PUT(_req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: "User-profile update is disabled in this preview build. Deploy to a full Next.js runtime to enable it.",
    },
    { status: 501 },
  )
}
