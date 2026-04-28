# CareerGuidance Portal

A full-stack career counselling web application that connects students with professional career counsellors. Students can browse counsellors, chat in real-time, read career blogs, and get AI-powered guidance. Counsellors manage their profiles, write blogs, and respond to students. Admins oversee the entire platform.

Built with **Django 5** (backend) and **React 18 + Vite** (frontend).

---

## Table of Contents

- [Features Overview](#features-overview)
- [User Types & Dashboards](#user-types--dashboards)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup-django)
- [Frontend Setup](#frontend-setup-react--vite)
- [Running the Full Stack](#running-the-full-stack)
- [Build for Production](#build-for-production)
- [Team](#team)

---

## Features Overview

- Role-based access for **Students**, **Counsellors**, and **Admins**
- Real-time chat between students and counsellors
- AI career guidance chatbot powered by **Google Gemini**
- Counsellor blog publishing system with admin approval workflow
- Multi-step counsellor registration with document uploads
- Real-time notifications via **Pusher**
- Email OTP verification via Gmail SMTP
- Admin approval workflows for counsellors, blogs, and reviews

---

## User Types & Dashboards

### 1. Student / General User

Students can use the platform without registering to browse, but need an account to chat or use CareerGPT.

**Public pages (no login required):**
| Page | Description |
|------|-------------|
| Home | Landing page with featured blogs, user reviews, and a CareerGPT shortcut |
| Browse Counsellors | View all approved counsellors with ratings and profiles |
| Blogs | Read career guidance articles published by counsellors |
| About Us | Information about the platform |

**Authenticated student pages:**
| Page | Description |
|------|-------------|
| Chat | Real-time messaging with a counsellor (SendBird-powered) |
| CareerGPT | AI career guidance chatbot powered by Google Gemini |
| Profile | Manage personal details (school, stream, age, gender — used for counsellor context) |
| Offer Counselling | Multi-step form to apply as a counsellor (uploads: profile photo, CNIC, transcripts) |

> When a student initiates their first chat with a counsellor, a profile gate collects school, stream, age, and gender so the counsellor has context.

---

### 2. Counsellor

Users approved by an admin gain the counsellor role and access to the counsellor dashboard.

**Counsellor Dashboard** (at `/counsellor`):
| Page | Description |
|------|-------------|
| Dashboard | Overview cards — total ratings, approved blogs, pending blogs, average rating |
| Add Blog | Rich-text editor to write and publish career guidance articles |
| My Blogs | Manage all published and pending blogs; edit existing posts |
| Chat | Real-time inbox to respond to students; click a student's name/avatar to view their profile (school, stream, age, gender) |
| Profile | Update counsellor profile details |

**Counsellor registration flow:**
- Any student can apply via "Offer Counselling"
- Application status is **Pending** until an admin approves it
- Pending users can cancel their application at any time from their profile or when attempting to chat
- After approval, the user gains access to the counsellor dashboard on next login

---

### 3. Admin

Admin accounts are set manually in the database. Admins land directly on the admin dashboard after login.

**Admin Dashboard** (at `/admin/dashboard`):
| Page | Description |
|------|-------------|
| Dashboard | Platform metrics — total users, counsellors, blogs, reviews with chart |
| Approve Counsellors | Review pending counsellor applications; view CNIC and education docs; approve or reject with optional reason |
| Approve Blogs | Review blogs submitted by counsellors; approve or reject with a reason (rejection reason is emailed to the counsellor) |
| Approve Reviews | Moderate user testimonials submitted on the platform; approve or delete |
| User Report | Full list of registered users with delete capability |
| Counsellor Report | Full list of approved counsellors with delete capability |
| Profile | Admin account settings |

---

## Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Django 5 | Web framework, session-based authentication |
| Django REST Framework | API views |
| django-cors-headers | CORS for React dev server |
| SQLite | Database (no setup required) |
| Pusher | Real-time notifications |
| Google Gemini | CareerGPT AI responses |
| Gmail SMTP | OTP emails and counsellor approval notifications |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework and build tool |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing |
| Axios | HTTP requests (with session cookies) |
| Material UI (MUI) | UI components (menus, data grids, modals) |
| SendBird UIKit | Real-time chat SDK |
| Pusher JS | Real-time notification client |
| React Chatbot Kit | CareerGPT chatbot interface |
| Chart.js / Recharts | Admin dashboard charts |
| TinyMCE / Jodit | Blog rich-text editor |

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Python | 3.10 – 3.12 | **Python 3.13 is not supported** (breaks psycopg2-binary) |
| Node.js | 18 LTS or 20 LTS | [nodejs.org](https://nodejs.org) |
| npm | bundled with Node.js | — |
| Git | any | — |

---

## Project Structure

```
CareerGuidance-FS/
├── career_counselling_portal/       # Django project
│   ├── career_portal/               # Main app — models, views, urls, utils
│   │   ├── models.py                # ACU, Counsellor, Blogs, Ratings, Reviews, etc.
│   │   ├── views.py                 # All API endpoints (flat function-based views)
│   │   ├── urls.py                  # URL routing
│   │   └── Utils/
│   │       ├── sendbird.py          # SendBird REST API wrapper
│   │       └── counsellor.py        # File upload helpers
│   ├── career_counselling_portal/
│   │   └── settings.py             # Django config (DB, email, SendBird, CORS)
│   └── manage.py
├── src/                             # React source
│   ├── pages/                       # Student-facing pages
│   ├── dashboards/
│   │   ├── admin/                   # Admin dashboard pages & layout
│   │   └── counsellor/              # Counsellor dashboard pages & layout
│   ├── features/                    # Redux slices (one per feature)
│   ├── layouts/                     # Shared layouts and auth guards
│   └── assets/styles/               # CSS modules
├── requirements.txt                 # Python dependencies
├── package.json                     # Node dependencies
└── vite.config.js
```

---

## Backend Setup (Django)

### 1. Create and activate a virtual environment

```bash
# From the repo root (CareerGuidance-FS/)
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 2. Install Python dependencies

```bash
pip install -r requirements.txt
```

> **Note:** Do not install `psycopg2-binary` — the project uses SQLite and psycopg2 fails on Python 3.13.

### 3. Apply database migrations

```bash
cd career_counselling_portal
python manage.py migrate
```

### 4. (Optional) Create an admin user

Admin accounts must be assigned manually. Either use the Django shell:

```bash
python manage.py shell
```

```python
from career_portal.models import ACU
user = ACU.objects.get(email='your@email.com')
user.role = 'A'
user.save()
```

Or use the Django admin panel at `http://127.0.0.1:8000/admin` (create a superuser first with `python manage.py createsuperuser`).

### 5. Run the Django development server

```bash
# Inside career_counselling_portal/
python manage.py runserver
```

Backend available at **http://127.0.0.1:8000**

---

## Frontend Setup (React + Vite)

### 1. Install Node dependencies

```bash
# From the repo root (CareerGuidance-FS/)
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to a peer dependency conflict in `sendbird-uikit`.

### 2. Run the Vite development server

```bash
npm run dev
```

Frontend available at **http://127.0.0.1:5173**

---

## Running the Full Stack

Both servers must run **simultaneously** in separate terminals.

**Terminal 1 — Backend:**
```bash
cd career_counselling_portal
python manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open **http://127.0.0.1:5173** in your browser.

---

## Build for Production

```bash
# Frontend — outputs to dist/
npm run build

# Backend — collect static files
cd career_counselling_portal
python manage.py collectstatic
```

---

## Team

- Praveen Kaushik — 2200290120127  
- Piyush Varshney — 2200290120119
