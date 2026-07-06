import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { convex } from "@/lib/convex"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    await convex.mutation("data:submitContact", { name, email, subject, message })

    // Send email via nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Email to you (site owner)
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      subject: `🎯 New Contact: ${subject} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f5f7fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #145da0 0%, #0f3d6e 100%); padding: 40px 30px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 30px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 14px; color: #145da0; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
            .info-box { background-color: #f8f9fb; border-left: 4px solid #145da0; padding: 16px; border-radius: 4px; margin-bottom: 16px; }
            .info-row { display: flex; margin-bottom: 12px; }
            .info-row:last-child { margin-bottom: 0; }
            .info-label { font-weight: 700; color: #333; width: 100px; }
            .info-value { color: #666; flex: 1; word-break: break-word; }
            .message-box { background-color: #f8f9fb; border-left: 4px solid #145da0; padding: 20px; border-radius: 4px; line-height: 1.6; color: #333; white-space: pre-wrap; word-wrap: break-word; }
            .reply-box { background-color: #e8f4f8; padding: 16px; border-radius: 6px; margin-top: 20px; text-align: center; }
            .reply-link { display: inline-block; background-color: #145da0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; margin-top: 10px; }
            .footer { background-color: #f5f7fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e5eb; font-size: 12px; color: #888; }
            .badge { display: inline-block; background-color: #145da0; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Contact Submission</h1>
              <p>You have a new message from your website contact form</p>
            </div>
            
            <div class="content">
              <div class="section">
                <div class="section-title">Contact Information</div>
                <div class="info-box">
                  <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><a href="mailto:${email}" style="color: #145da0; text-decoration: none;">${email}</a></span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Subject:</span>
                    <span class="info-value"><strong>${subject}</strong></span>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Message</div>
                <div class="message-box">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "\n")}</div>
              </div>

              <div class="reply-box">
                <strong>💡 Quick Action</strong>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Reply directly to ${email}</p>
                <a href="mailto:${email}?subject=Re: ${subject}" class="reply-link">Reply to ${name}</a>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0;">This message was submitted through your Techtics website contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      replyTo: email,
    }

    await transporter.sendMail(mailOptions)

    // Optional: Send auto-reply to the customer
    if (process.env.SEND_AUTO_REPLY === "true") {
      const autoReplyOptions = {
        from: process.env.SMTP_FROM_EMAIL,
        to: email,
        subject: "✅ We received your message - Techtics",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f5f7fa; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #145da0 0%, #0f3d6e 100%); padding: 40px 30px; text-align: center; color: white; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
              .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
              .content { padding: 30px; }
              .greeting { font-size: 18px; color: #333; font-weight: 600; margin-bottom: 20px; }
              .message-section { background-color: #f8f9fb; border-left: 4px solid #145da0; padding: 20px; border-radius: 4px; margin: 20px 0; }
              .message-section p { margin: 0; color: #666; line-height: 1.6; }
              .highlight { background-color: #e8f4f8; padding: 16px; border-radius: 6px; margin: 20px 0; text-align: center; }
              .timeline { margin: 30px 0; }
              .timeline-item { display: flex; margin-bottom: 20px; }
              .timeline-icon { width: 40px; height: 40px; background-color: #145da0; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; margin-right: 16px; }
              .timeline-content { flex: 1; }
              .timeline-title { font-weight: 700; color: #333; margin-bottom: 4px; }
              .timeline-desc { color: #666; font-size: 14px; }
              .cta-button { display: inline-block; background-color: #145da0; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .footer { background-color: #f5f7fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e5eb; font-size: 12px; color: #888; }
              .social-links { margin: 20px 0; }
              .social-links a { display: inline-block; margin: 0 10px; color: #145da0; text-decoration: none; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Message Received!</h1>
                <p>Thank you for reaching out to Techtics</p>
              </div>
              
              <div class="content">
                <p class="greeting">Hi ${name},</p>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                  We're thrilled to hear from you! Your message has been successfully received and is now in our queue.
                </p>

                <div class="message-section">
                  <p style="margin-bottom: 12px;"><strong>Your Message Summary:</strong></p>
                  <div style="background-color: white; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                    <strong style="color: #145da0;">Subject:</strong> ${subject}
                  </div>
                  <div style="background-color: white; padding: 12px; border-radius: 4px;">
                    <strong style="color: #145da0;">Message:</strong>
                    <p style="margin: 8px 0 0 0; color: #555; white-space: pre-wrap; word-wrap: break-word;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "\n")}</p>
                  </div>
                </div>

                <div class="timeline">
                  <div class="timeline-item">
                    <div class="timeline-icon">✓</div>
                    <div class="timeline-content">
                      <div class="timeline-title">Message Received</div>
                      <div class="timeline-desc">Your message is safe with us</div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="timeline-icon">📋</div>
                    <div class="timeline-content">
                      <div class="timeline-title">Under Review</div>
                      <div class="timeline-desc">Our team is reviewing your inquiry</div>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="timeline-icon">💬</div>
                    <div class="timeline-content">
                      <div class="timeline-title">Quick Response</div>
                      <div class="timeline-desc">You'll hear from us within 24 hours</div>
                    </div>
                  </div>
                </div>

                <div class="highlight">
                  <p style="margin: 0; color: #333; font-weight: 600;">⏱️ Expected Response Time: 24 Hours</p>
                  <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">We usually respond even faster!</p>
                </div>

                <p style="color: #666; line-height: 1.6; margin: 20px 0;">
                  In the meantime, feel free to explore more about our services or reach out to us directly for urgent matters.
                </p>

                <div style="text-align: center;">
                  <a href="https://techtics.com" class="cta-button">Visit Our Website</a>
                </div>

                <p style="color: #666; line-height: 1.6; font-size: 14px; margin-top: 30px;">
                  <strong>Questions?</strong> You can always reply to this email, and it will reach our support team directly.
                </p>
              </div>

              <div class="footer">
                <p style="margin: 0 0 10px 0;"><strong>Techtics</strong> - Building Tomorrow's Digital Solutions</p>
                <div class="social-links">
                  <a href="https://techtics.com">Website</a>
                  <a href="mailto:mohan0512vittal@gmail.com">Email Us</a>
                </div>
                <p style="margin: 10px 0 0 0; font-size: 11px;">© 2025 Techtics. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }
      await transporter.sendMail(autoReplyOptions)
    }

    return NextResponse.json(
      { success: true, message: "Contact message sent successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error submitting contact:", error)
    return NextResponse.json(
      { error: "Failed to submit contact. Please try again later." },
      { status: 500 }
    )
  }
}
