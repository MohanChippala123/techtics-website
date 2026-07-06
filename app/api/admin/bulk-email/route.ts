import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/convex"

// Helper to validate API key
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-admin-key") || request.headers.get("X-API-Key")
  const validKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "default-admin-key"
  return apiKey === validKey
}

// Helper to parse CSV with better error handling
function parseCSV(csvText: string): {
  success: boolean
  contacts?: Array<{
    businessName: string
    email: string
    city: string
    state: string
    category: string
  }>
  error?: string
} {
  try {
    const lines = csvText.trim().split("\n")
    if (lines.length < 2) {
      return { success: false, error: "CSV must have at least a header row and one data row" }
    }

    // Parse header - handle different line endings
    const headerLine = lines[0].replace(/\r/g, "")
    const header = headerLine.split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""))

    console.log("CSV Header parsed:", header)

    // Find column indices with more flexible matching
    const businessNameIdx = header.findIndex((h) =>
      ["business name", "businessname", "business", "name", "company", "company name"].includes(h)
    )
    const emailIdx = header.findIndex((h) => ["email", "e-mail", "mail", "email address"].includes(h))
    const cityIdx = header.findIndex((h) => ["city", "town", "location"].includes(h))
    const stateIdx = header.findIndex((h) => ["state", "province", "region", "st"].includes(h))
    const categoryIdx = header.findIndex((h) => ["category", "type", "industry", "business type"].includes(h))

    console.log("Column indices:", { businessNameIdx, emailIdx, cityIdx, stateIdx, categoryIdx })

    if (emailIdx === -1) {
      return { 
        success: false, 
        error: `CSV must have an 'Email' column. Found columns: ${header.join(", ")}` 
      }
    }

    const contacts: Array<{
      businessName: string
      email: string
      city: string
      state: string
      category: string
    }> = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/\r/g, "").trim()
      if (!line) continue

      // Handle quoted values in CSV
      const values: string[] = []
      let current = ""
      let inQuotes = false

      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const email = values[emailIdx]?.replace(/['"]/g, "").trim()
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.log(`Skipping invalid email at row ${i + 1}:`, email)
        continue
      }

      contacts.push({
        businessName: businessNameIdx >= 0 ? values[businessNameIdx]?.replace(/['"]/g, "").trim() || "Unknown Business" : "Unknown Business",
        email,
        city: cityIdx >= 0 ? values[cityIdx]?.replace(/['"]/g, "").trim() || "" : "",
        state: stateIdx >= 0 ? values[stateIdx]?.replace(/['"]/g, "").trim() || "" : "",
        category: categoryIdx >= 0 ? values[categoryIdx]?.replace(/['"]/g, "").trim() || "" : "",
      })
    }

    if (contacts.length === 0) {
      return { success: false, error: "No valid email addresses found in CSV" }
    }

    return { success: true, contacts }
  } catch (error) {
    console.error("CSV parsing error:", error)
    return { 
      success: false, 
      error: `Failed to parse CSV: ${error instanceof Error ? error.message : String(error)}` 
    }
  }
}

// GET - Fetch contacts or templates
export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const batchId = searchParams.get("batchId")

    console.log("Bulk Email GET: type =", type, "batchId =", batchId)

    if (type === "templates") {
      const templates = await db.list("bulkEmailTemplates")
      console.log("Bulk Email GET: Found", templates.length, "templates")
      return NextResponse.json(templates)
    }

    if (type === "contacts") {
      const contacts = await db.list("bulkEmailContacts", { batchId: batchId || undefined, limit: 500 })
      console.log("Bulk Email GET: Found", contacts.length, "contacts")
      return NextResponse.json(contacts)
    }

    if (type === "batches") {
      // Get unique batches with counts
      const batches = await db.batches()
      console.log("Bulk Email GET: Found", batches.length, "batches")
      return NextResponse.json(batches)
    }

    return NextResponse.json({ error: "Invalid type parameter. Use: templates, contacts, or batches" }, { status: 400 })
  } catch (error) {
    console.error("Error in bulk-email GET:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    return NextResponse.json(
      { 
        error: "Failed to fetch data", 
        details: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

// POST - Import contacts or create template or send bulk emails
export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action } = body

    console.log("Bulk Email POST: action =", action)

    // Import CSV contacts
    if (action === "import") {
      const { csvData } = body
      if (!csvData) {
        return NextResponse.json({ error: "CSV data is required" }, { status: 400 })
      }

      console.log("Bulk Email POST: Parsing CSV, length =", csvData.length)
      
      // Use the safer parseCSV function
      const parseResult = parseCSV(csvData)
      
      if (!parseResult.success || !parseResult.contacts) {
        return NextResponse.json({ error: parseResult.error || "Failed to parse CSV" }, { status: 400 })
      }

      const contacts = parseResult.contacts
      console.log("Bulk Email POST: Parsed", contacts.length, "contacts")

      const batchId = `batch_${Date.now()}`
      const contactsWithBatch = contacts.map((c) => ({
        ...c,
        batchId,
        status: "pending",
      }))

      console.log("Bulk Email POST: Inserting contacts with batchId =", batchId)
      await db.createMany("bulkEmailContacts", contactsWithBatch)
      console.log("Bulk Email POST: Inserted successfully")

      return NextResponse.json({
        success: true,
        batchId,
        count: contacts.length,
        message: `Imported ${contacts.length} contacts`,
      })
    }

    // Create template
    if (action === "createTemplate") {
      const { name, subject, body: templateBody, description } = body
      if (!name || !subject || !templateBody) {
        return NextResponse.json({ error: "Name, subject, and body are required" }, { status: 400 })
      }

      console.log("Bulk Email POST: Creating template:", name)
      const template = await db.create("bulkEmailTemplates", {
        name,
        subject,
        body: templateBody,
        description,
      })
      console.log("Bulk Email POST: Template created:", template._id)

      return NextResponse.json(template)
    }

    // Send bulk emails
    if (action === "sendBulk") {
      const { batchId, templateId, customSubject, customBody } = body

      if (!batchId) {
        return NextResponse.json({ error: "Batch ID is required" }, { status: 400 })
      }

      // Get template or use custom content
      let subject = customSubject
      let bodyTemplate = customBody

      if (templateId) {
        const template = await db.get(templateId)
        if (template) {
          subject = subject || String(template.subject)
          bodyTemplate = bodyTemplate || String(template.body)
        }
      }

      if (!subject || !bodyTemplate) {
        return NextResponse.json({ error: "Subject and body are required" }, { status: 400 })
      }

      // Get pending contacts from batch
      const contacts = await db.list("bulkEmailContacts", { batchId, status: "pending", limit: 50 })

      if (contacts.length === 0) {
        return NextResponse.json({ error: "No pending contacts in this batch" }, { status: 400 })
      }

      // Setup SMTP
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_SECURE, SMTP_FROM_EMAIL, SMTP_FROM_NAME } =
        process.env

      if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        return NextResponse.json({ 
          error: "SMTP not configured", 
          details: "Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD in your environment variables" 
        }, { status: 500 })
      }

      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_SECURE === "true",
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      })

      const fromAddress = `${SMTP_FROM_NAME || "Techtics"} <${SMTP_FROM_EMAIL || SMTP_USER}>`
      const results = { sent: 0, failed: 0 }

      for (const contact of contacts) {
        try {
          // Replace placeholders
          const personalizedSubject = subject
            .replace(/{{businessName}}/gi, String(contact.businessName || ""))
            .replace(/{{city}}/gi, String(contact.city || ""))
            .replace(/{{state}}/gi, String(contact.state || ""))
            .replace(/{{category}}/gi, String(contact.category || ""))

          const personalizedBody = bodyTemplate
            .replace(/{{businessName}}/gi, String(contact.businessName || ""))
            .replace(/{{city}}/gi, String(contact.city || ""))
            .replace(/{{state}}/gi, String(contact.state || ""))
            .replace(/{{category}}/gi, String(contact.category || ""))

          await transporter.sendMail({
            from: fromAddress,
            to: String(contact.email),
            subject: personalizedSubject,
            html: personalizedBody,
            text: personalizedBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
          })

          await db.update(contact._id, { status: "sent", sentAt: Date.now() })
          results.sent++

          // Small delay between emails
          await new Promise((resolve) => setTimeout(resolve, 500))
        } catch (error) {
          console.error("Failed to send email to:", contact.email, error)
          await db.update(contact._id, {
            status: "failed",
            errorMessage: error instanceof Error ? error.message : String(error),
          })
          results.failed++
        }
      }

      return NextResponse.json({
        success: true,
        ...results,
        message: `Sent ${results.sent} emails, ${results.failed} failed`,
      })
    }

    return NextResponse.json({ error: "Invalid action. Use: import, createTemplate, or sendBulk" }, { status: 400 })
  } catch (error) {
    console.error("Error in bulk-email POST:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    return NextResponse.json(
      { 
        error: "Operation failed", 
        details: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

// PUT - Update template
export async function PUT(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, data } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 })
    }

    const template = await db.update(id, data)
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error updating template:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: "Failed to update template", details: errorMessage },
      { status: 500 }
    )
  }
}

// DELETE - Delete contacts or templates
export async function DELETE(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { type, id, batchId } = await request.json()

    if (type === "template" && id) {
      await db.remove(id)
      return NextResponse.json({ success: true, message: "Template deleted" })
    }

    if (type === "batch" && batchId) {
      const deletedCount = await db.removeBatch(batchId)
      return NextResponse.json({ success: true, message: `Deleted ${deletedCount} contacts` })
    }

    if (type === "contact" && id) {
      await db.remove(id)
      return NextResponse.json({ success: true, message: "Contact deleted" })
    }

    return NextResponse.json({ error: "Invalid delete request. Provide type and id/batchId" }, { status: 400 })
  } catch (error) {
    console.error("Error deleting:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: "Delete failed", details: errorMessage },
      { status: 500 }
    )
  }
}
