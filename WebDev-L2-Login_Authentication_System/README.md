# TaskHub - Secure Login Authentication System

A simple, clean, and fully functional authentication system built using **HTML5, Vanilla CSS3, Vanilla JavaScript, Node.js, Express.js, SQLite, bcrypt, and express-session**.

---

## 📸 Reference Designs & Interface

The system is styled to match modern product authentication flows:

1. **Login Page (`/login`)**:
   - Modern split-layout card with mountain aesthetic banner
   - Login with either **Username** or **Email**
   - Password visibility toggle (show / hide)
   - "Remember me" and "Forgot password?" links
   - Generic authentication error handling to prevent user enumeration
   - "Continue with Google" social action button

2. **Registration Page (`/register`)**:
   - Split-layout card with workspace productivity banner
   - Real-time password criteria validation checklist:
     - ✓ At least 8 characters
     - ✓ At least 1 number
     - ✓ Use letters and numbers
   - Duplicate username and email prevention
   - Secure bcrypt password hashing before storing in SQLite

3. **Protected Dashboard (`/dashboard`)**:
   - Protected by `requireAuth` server-side middleware
   - Redirects unauthenticated users immediately to `/login`
   - Hero welcome banner displaying dynamic user name: `Welcome, [Username]!`
   - Account Information card (Username, Email, Authentication Status, Member Since)
   - Task overview cards (Total Tasks, Pending Tasks, Completed Tasks)
   - Recent activity timeline
   - One-click **Logout** button that destroys the session and redirects to `/login`

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript (no frameworks)
- **Backend**: Node.js & Express.js
- **Database**: SQLite3 (`database/users.db`)
- **Password Security**: `bcrypt` (10 salt rounds)
- **Session Management**: `express-session` (HTTP-only cookies)

---

## 📁 Project Structure

```text
WebDev-L2-Login_Authentication_System/
│
├── database/
│   └── users.db               # SQLite database file with users table
│
├── public/
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── dashboard.html         # Protected dashboard page
│   │
│   ├── css/
│   │   └── style.css          # Design system & responsive styles
│   │
│   ├── js/
│   │   ├── login.js           # Client login handling & validation
│   │   ├── register.js        # Client registration & live checklist
│   │   └── dashboard.js       # Dashboard session profile & logout
│   │
│   └── images/
│       ├── mountains.jpg      # Login banner image
│       ├── workspace.jpg      # Registration banner image
│       └── dashboard-hero.jpg # Dashboard hero illustration
│
├── server/
│   ├── database.js            # SQLite connection & query helpers
│   ├── middleware.js          # requireAuth & redirectIfAuth middlewares
│   └── auth.js                # Auth endpoints (/register, /login, /logout, /me)
│
├── server.js                  # Express server entry point
├── package.json               # Dependencies & scripts
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### 1. Installation

Ensure you have Node.js installed. In this folder:

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

For development with automatic reload on changes:

```bash
npm run dev
```

### 3. Open in Browser

Open your browser and navigate to:

```text
http://localhost:3000
```

---

## 🔒 Security Practices Implemented

- **No Plaintext Passwords**: Passwords are never stored as plain text. Every password is encrypted using a cryptographic one-way salt and hash with `bcrypt`.
- **No Password Exposure**: Hashes are stripped from responses and never sent to the client.
- **Generic Login Errors**: When authentication fails, the server returns the generic message `"Invalid username/email or password."` to prevent user enumeration attacks.
- **Authoritative Server Validation**: Input fields, email format, and password criteria are enforced both client-side for user experience and server-side for authoritative security.
- **Protected Routing**: The `/dashboard` route and `/api/auth/me` endpoints are guarded by server-side session checks. Direct URL access without a session results in an automatic HTTP 302 redirect to `/login`.
- **Session Invalidation**: When logging out, `req.session.destroy()` destroys the server-side session and `res.clearCookie('connect.sid')` clears the browser cookie.
