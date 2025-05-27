import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email service is running' });
});

// Single email endpoint
app.post('/api/send-qr-email', async (req, res) => {
  try {
    const { attendee, origin } = req.body;

    if (!attendee || !attendee.email || !attendee.name || !attendee.qrCode) {
      return res.status(400).json({
        success: false,
        error: 'Missing required attendee fields (email, name, qrCode)'
      });
    }

    const qrCodeLink = `${origin}/scan/${attendee.qrCode}`;
    const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeLink)}&size=300x300`;

    const response = await resend.emails.send({
      from: SENDER_EMAIL,
      to: attendee.email,
      subject: 'Your QR Code for Event Check-In',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; margin-bottom: 24px;">Event Check-In QR Code</h1>
          <p style="margin-bottom: 16px;">Hello ${attendee.name},</p>
          <p style="margin-bottom: 24px;">Thank you for registering for our event. Below is your personal QR code for check-in:</p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${qrCodeLink}">
              <img src="${qrCodeImgUrl}" alt="QR Code" style="width: 300px; height: 300px;" />
            </a>
          </div>
          <p style="margin-bottom: 16px;">You can:</p>
          <ul style="margin-bottom: 24px;">
            <li>Show this email on your phone</li>
            <li>Take a screenshot of the QR code</li>
            <li>Print this email</li>
          </ul>
          <p style="color: #4b5563; font-size: 14px;">If you have any questions, please contact the event organizer.</p>
        </div>
      `,
    });

    console.log(`Email sent to ${attendee.email}`);
    res.json({ success: true, data: response });

  } catch (error) {
    console.error(`Failed to send email:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Bulk email endpoint
app.post('/api/send-bulk-emails', async (req, res) => {
  try {
    const { attendees, origin } = req.body;

    if (!Array.isArray(attendees) || attendees.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Attendees array is required and cannot be empty'
      });
    }

    let successful = 0;
    let failed = 0;
    const results = [];

    for (const attendee of attendees) {
      try {
        const qrCodeLink = `${origin}/scan/${attendee.qrCode}`;
        const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeLink)}&size=300x300`;

        const response = await resend.emails.send({
          from: SENDER_EMAIL,
          to: attendee.email,
          subject: 'Your QR Code for Event Check-In',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb; margin-bottom: 24px;">Event Check-In QR Code</h1>
              <p style="margin-bottom: 16px;">Hello ${attendee.name},</p>
              <p style="margin-bottom: 24px;">Thank you for registering for our event. Below is your personal QR code for check-in:</p>
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${qrCodeLink}">
                  <img src="${qrCodeImgUrl}" alt="QR Code" style="width: 300px; height: 300px;" />
                </a>
              </div>
              <p style="margin-bottom: 16px;">You can:</p>
              <ul style="margin-bottom: 24px;">
                <li>Show this email on your phone</li>
                <li>Take a screenshot of the QR code</li>
                <li>Print this email</li>
              </ul>
              <p style="color: #4b5563; font-size: 14px;">If you have any questions, please contact the event organizer.</p>
            </div>
          `,
        });

        successful++;
        results.push({ email: attendee.email, success: true, response });

      } catch (error) {
        failed++;
        results.push({
          email: attendee.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Failed to send email to ${attendee.email}:`, error);
      }
    }

    res.json({
      success: true,
      summary: { successful, failed, total: attendees.length },
      results
    });

  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

const server = app.listen(port, () => {
  console.log(`Email service running on port ${port}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Email service terminated');
  });
});

export default app;
