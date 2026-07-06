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

// GET - Fetch data
export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type")

    if (!verifyAdminAccess(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (type === "services") {
      const services = await db.list("services")
      console.log(`✅ Fetched ${services.length} services`)
      return NextResponse.json(services)
    } else if (type === "pricing") {
      const pricing = await db.list("pricing")
      console.log(`✅ Fetched ${pricing.length} pricing items`)
      return NextResponse.json(pricing)
    } else if (type === "contacts") {
      const contacts = await db.list("contacts")
      console.log(`✅ Fetched ${contacts.length} contacts`)
      return NextResponse.json(contacts)
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("❌ Error fetching data:", error)
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

// POST - Add data
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAccess(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, type, data } = body

    if (action === "add") {
      if (type === "service") {
        const newService = await db.create("services", data)
        return NextResponse.json(newService, { status: 201 })
      } else if (type === "pricing") {
        const newPricing = await db.create("pricing", data)
        return NextResponse.json(newPricing, { status: 201 })
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error adding data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update data
export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdminAccess(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, id, data } = body

    if (type === "service") {
      const updated = await db.update(id, data)
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json(updated)
    } else if (type === "pricing") {
      const updated = await db.update(id, data)
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json(updated)
    } else if (type === "contact") {
      const updated = await db.update(id, data)
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Error updating data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete data
export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdminAccess(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, id } = await request.json()

    if (type === "service") {
      const deleted = await db.remove(id)
      if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    } else if (type === "pricing") {
      const deleted = await db.remove(id)
      if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    } else if (type === "contact") {
      const deleted = await db.remove(id)
      if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Error deleting data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
