import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin

  return NextResponse.json({
    message: "Google OAuth Configuration Check",
    currentOrigin: origin,
    requiredRedirectURIs: [
      origin,
      `${origin}/`,
      "http://localhost:3000",
      "http://localhost:3000/",
      "https://your-domain.com",
      "https://your-domain.com/",
    ],
    clientId: "842886805549-4ph69g15llsl7h1uh01c537oos5n29d0.apps.googleusercontent.com",
    instructions: {
      step1: "Go to Google Cloud Console",
      step2: "Navigate to APIs & Services > Credentials",
      step3: "Click on your OAuth 2.0 Client ID",
      step4: "Add the above redirect URIs to 'Authorized JavaScript origins'",
      step5: "Save the changes and wait a few minutes for propagation",
    },
  })
}
