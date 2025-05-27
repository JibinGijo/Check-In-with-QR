# Check-In System

A modern event check-in system built with React, Supabase, and Vite. Easily import attendees, generate and email QR codes, and manage check-ins with a user-friendly dashboard and real-time updates.

## Features

- **CSV Import:** Upload attendee lists via CSV.
- **QR Code Generation:** Unique QR codes for each attendee.
- **Bulk Emailing:** Send QR codes to attendees via email.
- **Check-In Scanner:** Scan QR codes to check in attendees.
- **Dashboard:** View stats, recent check-ins, and pending attendees.
- **Export:** Download attendee data as CSV.
- **Responsive UI:** Works on desktop and mobile.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/) (Postgres + Auth)
- [Express](https://expressjs.com/) (Email microservice)
- [Resend](https://resend.com/) (Transactional email API)
- [Tailwind CSS](https://tailwindcss.com/)
- [QRCode](https://github.com/zpao/qrcode.react) (QR code generation)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) (QR code scanning)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Supabase project (see below)
- Resend account for email sending

### 1. Clone the repository

```sh
git clone https://github.com/JibinGijo/check-in-with-qr.git
cd check-in-system
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure Supabase

- Create a [Supabase](https://app.supabase.com/) project.
- Create the `attendees` table and enable RLS using the SQL in [`supabase/migrations/`](supabase/migrations/).
- Get your Supabase URL and anon key.

### 4. Configure environment variables

Create a `.env` file in the root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
SENDER_EMAIL=your_verified_sender_email
PORT=3001
```

### 5. Start the development servers

Start the email server:

```sh
npm run server
```

Start the frontend:

```sh
npm run dev
```

- Frontend: http://localhost:5173
- Email API: http://localhost:3001

## Usage

1. **Import Attendees:** Go to "Import CSV" and upload your attendee list.
2. **Send QR Codes:** Use "QR Codes" or "Attendees" to send QR codes via email.
3. **Check-In:** Use the "Scanner" page to scan attendee QR codes at the event.
4. **Dashboard:** Monitor stats and recent activity on the dashboard.

## Folder Structure

- [`src/`](src/) - React frontend
- [`server/`](server/) - Express email API
- [`supabase/`](supabase/) - Database migrations

## License

MIT

---

**Made with ❤️ for event organizers.**