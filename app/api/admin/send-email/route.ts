import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

interface SendEmailRequest {
  toEmail: string
  toName: string
  subject: string
  body: string
  cc?: string[]
  bcc?: string[]
  replyTo?: string
}

function buildPlainText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function getSmtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_SECURE, SMTP_FROM_EMAIL, SMTP_FROM_NAME } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error("SMTP credentials are not fully configured")
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    fromEmail: SMTP_FROM_EMAIL || SMTP_USER,
    fromName: SMTP_FROM_NAME || "Techtics",
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("X-API-Key")
    const validKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "default-admin-key"

    if (apiKey !== validKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data: SendEmailRequest = await request.json()

    if (!data.toEmail || !data.toName || !data.subject || !data.body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.toEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const smtp = getSmtpConfig()
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: smtp.auth,
    })

    const fromAddress = `${smtp.fromName} <${smtp.fromEmail}>`
    const response = await transporter.sendMail({
      from: fromAddress,
      to: data.toEmail,
      cc: data.cc,
      bcc: data.bcc,
      replyTo: data.replyTo || smtp.fromEmail,
      subject: data.subject,
      html: data.body,
      text: buildPlainText(data.body),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Email sent",
        details: {
          recipient: data.toEmail,
          subject: data.subject,
          messageId: response.messageId,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sending email:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Failed to send email", details: message }, { status: 500 })
  }
}
