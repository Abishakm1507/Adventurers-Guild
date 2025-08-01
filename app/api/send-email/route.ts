import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    try {
        const { name, email } = await request.json()

        // Create SMTP transporter with optimizations
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            pool: true, // Use connection pooling
            maxConnections: 5, // Limit connections
            maxMessages: 100, // Limit messages per connection
            connectionTimeout: 8000, // 8 seconds (reduced)
            greetingTimeout: 3000, // 3 seconds (reduced)
            socketTimeout: 10000, // 10 seconds (reduced)
        })

        // Welcome email to the user
        const welcomeEmail = {
            from: `"The Adventurers Guild" <${process.env.SMTP_USER}>`,
            to: email,
            subject: '🛡️ You’ve Joined the Waitlist – Your Quest Board Access is Near!',
            html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome Client - The Adventurers Guild</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

      <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px; border-radius: 12px; text-align: center;">
        <h1 style="margin: 0 0 10px 0; font-size: 30px;">🛡️ The Adventurers Guild 🛡️</h1>
        <p style="margin: 0; font-size: 18px;">Welcome to the Quest Board for Digital Pioneers</p>
      </div>

      <div style="background: #f0f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333;">Hello Guild Client,</h2>
        <p>Thank you for expressing interest in partnering with <strong>The Adventurers Guild</strong> – a revolutionary, gamified platform connecting industry partners with a driven community of computer science students and developers.</p>
        <p>You're now on the <strong>Client Waitlist</strong>! 🚀</p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #333;">🧭 What Happens Next:</h3>
        <ol style="padding-left: 20px;">
          <li><strong>Account Setup:</strong> We’ll notify you once your client portal is ready.</li>
          <li><strong>Post Quests:</strong> You'll be able to submit real development problems (quests) to be solved by our ranked adventurers.</li>
          <li><strong>Track Progress:</strong> Get real-time updates, review submissions, and give feedback.</li>
          <li><strong>Pay Per Quest:</strong> Only pay for accepted work. We charge a platform service fee (15–30%) from the developer side.</li>
        </ol>
      </div>

      <div style="background: #e8f5e9; padding: 20px; border-radius: 8px;">
        <h3 style="color: #2e7d32;">⚔️ Why Companies Love Us:</h3>
        <ul style="padding-left: 20px;">
          <li>Access to a skilled and motivated talent pool</li>
          <li>Pre-vetted contributors ranked from F to S</li>
          <li>Fast project delivery with real mentorship</li>
          <li>Opportunity to support open-source education</li>
        </ul>
      </div>

      <div style="margin-top: 30px;">
        <h3 style="color: #333;">💬 Have Questions?</h3>
        <p>We’re always here to help you design a quest or review submissions.</p>
        <p>Reply to this email or connect with us on <a href="https://discord.gg/7hQYkEx5" style="color: #667eea;">Discord</a>.</p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://adventurersguild.vercel.app" style="background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">🌐 Visit Our Website</a>
      </div>

      <div style="text-align: center; font-size: 12px; color: #666; margin-top: 40px;">
        <p>The Adventurers Guild — Forging Digital Pioneers Since 2025</p>
        <p>This is an automated message. Please do not reply directly.</p>
      </div>

    </body>
    </html>
  `
        }

        // Admin notification email
        const adminEmail = {
            from: `"Guild System" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: '🎯 New Guild Member Enlisted!',
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 2px solid #667eea; border-radius: 8px;">
      <h2 style="color: #667eea;">⚔️ New Adventurer Joined The Guild!</h2>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Joined:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h4 style="margin-top: 0; color: #1976d2;">About The Adventurers Guild:</h4>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">
          Revolutionary gamified CS education platform where students become Guild Adventurers, 
          earning XP and progressing from F-Rank to S-Rank by completing real commissioned 
          projects from companies. We bridge the gap between theoretical knowledge and 
          industry-relevant practical skills.
        </p>
      </div>
      <div style="background: #f3e5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h4 style="margin-top: 0; color: #7b1fa2;">Key Features:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
          <li>Merit-based ranking system (F to S)</li>
          <li>Real-world commissioned quests</li>
          <li>Revenue sharing model (15–30% service fee)</li>
          <li>Community-driven learning</li>
          <li>GSSoC '25 official project</li>
          <li>Modern tech stack: React, Next.js, Node.js, PostgreSQL</li>
        </ul>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #666; font-size: 12px;">
          GitHub: <a href="https://github.com/LarytheLord/adventurers-guild" target="_blank">github.com/LarytheLord/adventurers-guild</a><br/>
          Discord: <a href="https://discord.gg/7hQYkEx5" target="_blank">discord.gg/7hQYkEx5</a>
        </p>
      </div>
    </div>
  `
        }


        // Send emails in parallel for faster response
        const [userEmailResult, adminEmailResult] = await Promise.allSettled([
            transporter.sendMail(welcomeEmail),
            transporter.sendMail(adminEmail)
        ])

        // Check if at least the user email was sent
        if (userEmailResult.status === 'fulfilled') {
            return NextResponse.json({
                message: 'Welcome email sent successfully!',
                success: true
            }, { status: 200 })
        } else {
            throw new Error('Failed to send welcome email')
        }

    } catch (error) {
        console.error('SMTP Error:', error)
        return NextResponse.json({
            message: 'Failed to send email',
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false
        }, { status: 500 })
    }
}
