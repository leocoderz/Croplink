// Environment variables configuration
export const env = {
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL || "",
}

// Validation function for required environment variables
export function validateEnv() {
  const requiredVars = {
    JWT_SECRET: env.JWT_SECRET,
    DATABASE_URL: env.DATABASE_URL,
  }

  const missing = Object.entries(requiredVars)
    .filter(([key, value]) => {
      if (key === "JWT_SECRET") {
        return !value || value === "your-super-secret-jwt-key-change-in-production"
      }
      return !value
    })
    .map(([key]) => key)

  if (missing.length > 0 && env.NODE_ENV === "production") {
    console.warn(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return missing.length === 0
}
