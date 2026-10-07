# UniDesk — Unified University Service Platform

UniDesk is a modern university service platform that provides **one front door for everything**. It routes student queries and university services across **IT, Finance, and Academic departments**.

The platform brings together:

* Student service requests
* IT support tickets
* Finance and fee management
* Academic timetable
* Exam schedules
* University notices
* Intent-based ticket routing
* Student and user management
* AI-assisted query understanding

---

## Prerequisites

Make sure you have the following installed:

* **Node.js** v18 or higher
* **npm**
* Git

---

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/hellomahii/UniDesk.git
cd UniDesk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

For Gemini AI integration:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

Replace `YOUR_GEMINI_API_KEY` with your actual Gemini API key.

**Do not commit your `.env.local` file to GitHub.**

### 4. Start the Frontend

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Running the Backend

UniDesk also includes a Python/FastAPI backend.

Make sure Python is installed, then navigate to the backend directory:

```bash
cd backend
```

Install the required Python dependencies if a requirements file is provided:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend API will run at:

```text
http://127.0.0.1:8000
```

---

## Available Scripts

| Command           | Description                           |
| :---------------- | :------------------------------------ |
| `npm run dev`     | Starts the Vite development server    |
| `npm run build`   | Builds the application for production |
| `npm run preview` | Previews the production build         |
| `npm run lint`    | Runs TypeScript type checking         |

---

## Project Structure

```text
UniDesk/
│
├── backend/
│   ├── database.py
│   ├── main.py
│   ├── users.py
│   ├── students.py
│   ├── tickets.py
│   ├── routing.py
│   ├── fees.py
│   ├── timetables.py
│   ├── exam_schedules.py
│   └── notices.py
│
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── types.ts
│   └── App.tsx
│
├── .env.local
├── package.json
└── README.md
```

---

## Login & Accounts

UniDesk uses a common university login system.

Depending on the configured backend database, users can log in using their registered **college email/user ID** and password.

The application supports:

* **Student**
* **IT Admin**
* **Finance Admin**
* **Academic Admin**

> Use the credentials configured in the backend database/environment rather than relying on hard-coded credentials in the frontend.

---

## UniDesk Routing

UniDesk is designed around intelligent query routing.

Student requests can be analyzed to determine:

1. **User intent**
2. **Relevant department**
3. **Routing confidence**

The routing model follows:

| Confidence    | Action                          |
| :------------ | :------------------------------ |
| **Above 75%** | Automatically route the request |
| **40% – 75%** | Ask for clarification           |
| **Below 40%** | Route to human support          |

The confidence information is primarily intended for administrative users.

---

## Departments

### IT

* Dashboard
* Tickets
* Intent Routing
* Student/User Information
* Notice+

### Finance

* Dashboard
* Tickets
* Intent Routing
* Fee Management
* Student/User Information
* Notice+

### Academic

* Dashboard
* Tickets
* Intent Routing
* Timetable
* Exam Schedule
* Student/User Information
* Notice+

### Student

* Dashboard
* Ask UniDesk
* Timetable
* Exam Schedule
* Notices
* My Tickets
* Student Profile

---

## Gemini AI Integration

UniDesk can use Google's Gemini API for AI-assisted university query understanding.

The Gemini API key should be configured through the environment variable:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

AI functionality is intended to support the UniDesk service-routing experience rather than replace the university service portal itself.

---

## Development Notes

* Frontend: **React + TypeScript**
* Build tool: **Vite**
* Styling: **Tailwind CSS**
* Icons: **Lucide React**
* Backend: **FastAPI**
* Da
