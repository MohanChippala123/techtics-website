import { NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/seed"

export async function GET(request: NextRequest) {
  try {
    // Optional: Add a secret key check for security
    const secret = request.nextUrl.searchParams.get("secret")
    const expectedSecret = process.env.INIT_SECRET || "init-techtics-db"

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await initializeDatabase()

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Initialization error:", error)
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    )
  }
}
