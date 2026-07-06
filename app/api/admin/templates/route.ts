import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/convex"
import { DEFAULT_EMAIL_TEMPLATES } from "@/lib/email-defaults"

function verifyAdminAccess(request: NextRequest) {
  const adminKey = request.headers.get("x-admin-key")
  const expectedKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "default-admin-key"

  return adminKey === expectedKey
}

export async function GET(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    let templates = await db.list("emailTemplates")

    if (!templates.length) {
      await db.createMany("emailTemplates", DEFAULT_EMAIL_TEMPLATES)
      templates = await db.list("emailTemplates")
    }

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const { name, subject, body, category, description, accent } = payload

    if (!name || !subject || !body || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const created = await db.create("emailTemplates", { name, subject, body, category, description, accent })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const { id, data } = payload

    if (!id || !data) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const updated = await db.update(id, data)

    if (!updated) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const deleted = await db.remove(id)

    if (!deleted) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
