# UniDesk — Unified University Service Platform

UniDesk is a modern university platform routing student queries, timetable schedules, exam schedules, and tickets across IT, Finance, and Academic departments.

---

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**, **yarn**, or **bun**

---

## How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The application will start on:
```
http://localhost:3000
```
Open this URL in your web browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port 3000 with network access (`0.0.0.0`). |
| `npm run build` | Compiles TypeScript and creates an optimized production bundle in the `dist/` directory. |
| `npm run preview` | Locally previews the production build created by `npm run build`. |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) to verify there are no syntax or type errors. |

---

## Logging In & Accounts

The common university login accepts college emails or user IDs:

- **Student**: `mahi.patel@bennett.edu.in` or `mahi` (Password: any password or `student123`)
- **IT Admin**: `it.admin@bennett.edu.in` or `it` (Password: any password or `admin123`)
- **Finance Admin**: `finance.admin@bennett.edu.in` or `finance` (Password: any password or `admin123`)
- **Academic Admin**: `academic.admin@bennett.edu.in` or `academic` (Password: any password or `admin123`)
