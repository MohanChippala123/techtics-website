import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/convex"

// Middleware to verify admin access
function verifyAdminAccess(request: NextRequest) {
  const adminKey = request.headers.get("x-admin-key")
  const expectedKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "default-admin-key"

  if (adminKey !== expectedKey) {
    return false
  }
  return true
}

// GET - Fetch settings
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAccess(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let settings = (await db.list("settings"))[0]

    if (!settings) {
      // Create default settings if not exists
      settings = await db.create("settings", {
        siteName: "Techtics",
        siteEmail: "mohan0512vittal@gmail.com",
        sitePhone: "+1 (704) 490-0265",
        aboutText: "Digital solutions company",
        adminPassword: "admin123",
      })
    }

    const safeSettings = { ...settings }
    delete safeSettings.adminPassword
    return NextResponse.json(safeSettings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdminAccess(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { siteName, siteEmail, sitePhone, aboutText } = body

    const current = (await db.list("settings"))[0]
    const settings = current
      ? await db.update(current._id, {
        siteName,
        siteEmail,
        sitePhone,
        aboutText,
      })
      : await db.create("settings", {
        siteName,
        siteEmail,
        sitePhone,
        aboutText,
        adminPassword: "admin123",
      })

    if (!settings) return NextResponse.json({ error: "Settings not found" }, { status: 404 })
    const safeSettings = { ...settings }
    delete safeSettings.adminPassword
    return NextResponse.json(safeSettings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Update password
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAccess(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { newPassword } = body

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const current = (await db.list("settings"))[0]
    if (current) {
      await db.update(current._id, {
        adminPassword: newPassword,
        lastPasswordChange: Date.now(),
      })
    } else {
      await db.create("settings", {
        siteName: "Techtics",
        siteEmail: "mohan0512vittal@gmail.com",
        sitePhone: "+1 (704) 490-0265",
        aboutText: "Digital solutions company",
        adminPassword: newPassword,
        lastPasswordChange: Date.now(),
      })
    }

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
