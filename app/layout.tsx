import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { SecurityProvider } from "@/components/security-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CropLink - Smart Farming Companion",
  description: "Your intelligent farming companion for crop management, weather monitoring, and agricultural insights.",
  keywords: "farming, agriculture, crop management, weather, smart farming",
  authors: [{ name: "CropLink Team" }],
  creator: "CropLink",
  publisher: "CropLink",
  robots: "noindex, nofollow, noarchive, nosnippet, noimageindex",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
   
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Security Meta Tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#10b981" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Prevent Caching */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* Security Headers */}
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        <link rel="icon" href="/favicon.ico" />

        {/* Inline Security Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Disable right-click
              document.addEventListener('contextmenu', e => e.preventDefault());
              
              // Disable text selection
              document.addEventListener('selectstart', e => e.preventDefault());
              
              // Disable drag and drop
              document.addEventListener('dragstart', e => e.preventDefault());
              
              // Disable print screen
              document.addEventListener('keyup', e => {
                if (e.keyCode === 44) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Disable F12 and other dev tools shortcuts
              document.addEventListener('keydown', e => {
                if (e.keyCode === 123 || 
                    (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                    (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
                    (e.ctrlKey && e.keyCode === 85)) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Disable zoom
              document.addEventListener('wheel', e => {
                if (e.ctrlKey) {
                  e.preventDefault();
                }
              }, { passive: false });
              
              // Disable pinch zoom on mobile
              document.addEventListener('touchstart', e => {
                if (e.touches.length > 1) {
                  e.preventDefault();
                }
              }, { passive: false });
              
              // Console warning
              console.clear();
              console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
              console.log('%cThis is a browser feature intended for developers. Unauthorized access is prohibited.', 'color: red; font-size: 16px;');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SecurityProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </SecurityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
