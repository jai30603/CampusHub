# 🎓 CampusHub — College Peer-to-Peer Marketplace

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](#)
[![Python](https://img.shields.io/badge/Python-3.12-blue)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688)](#)
[![React](https://img.shields.io/badge/React-19-61dafb)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

**CampusHub** is a full-stack, production-ready peer-to-peer marketplace web application built exclusively for university students. Students can buy, sell, and donate textbooks, electronics, notes, lab manuals, and campus gear — all within a secure, verified student community.

---

## ✨ Features

| # | Feature Area | Description |
|---|---|---|
| 1 | 🔐 **Authentication** | JWT-secured registration (`.edu` emails), login, logout, forgot/reset password, refresh tokens |
| 2 | 🛍 **Marketplace** | Search, multi-filter (category, campus, condition, price), Grid/List toggle, pagination |
| 3 | 📦 **Listing Management** | Create, edit, delete listings with up to 5 images, dynamic category attributes |
| 4 | ❤️ **Wishlist** | Save/unsave listings, dashboard counter, empty state handling |
| 5 | 💬 **Messaging** | Real-time-style conversation threads, read receipts, conversation history |
| 6 | 📋 **Reservations** | Reserve items, accept/reject/cancel, mark sold, reopen listing |
| 7 | ⭐ **Reviews & Ratings** | Post-transaction reviews with star ratings, public reputation, rating averages |
| 8 | 🔔 **Notifications** | Auto-generated activity feed, unread badge, mark read/all, preferences |
| 9 | 🛡 **Admin Portal** | User management, listing audit, category CRUD, moderation reports, activity log, platform settings |
| 10 | 📊 **Analytics** | KPI dashboard, registration charts, category distribution, conversion funnel, CSV export |

---

## 🏗 Architecture

```
┌─────────────────────────────────────┐     ┌───────────────────────────────┐
│          React 19 Frontend          │────▶│      FastAPI Backend           │
│  TypeScript · Tailwind CSS v4       │     │  Python 3.12 · SQLAlchemy 2.0  │
│  React Router v7 · Lucide React     │     │  Pydantic v2 · Alembic          │
│  Deployed: Vercel                   │     │  Deployed: Render               │
└─────────────────────────────────────┘     └──────────────┬────────────────┘
                                                           │
                                            ┌──────────────▼────────────────┐
                                            │         Database               │
                                            │  Local: SQLite (zero config)   │
                                            │  Prod:  Supabase PostgreSQL    │
                                            └───────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | 6.0 | Type Safety |
| Vite | 8 | Build Tool + Dev Server |
| Tailwind CSS | v4 | Utility Styling |
| React Router | v7 | Client-side Routing |
| Lucide React | latest | Icon Library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.110+ | REST API Framework |
| Python | 3.12 | Runtime |
| SQLAlchemy | 2.0 | ORM |
| Alembic | 1.13+ | Database Migrations |
| Pydantic | v2 | Data Validation |
| Passlib (bcrypt) | 1.7+ | Password Hashing |
| python-jose | 3.3+ | JWT Tokens |
| Cloudinary | 1.39+ | Image Storage (Production) |

---

## 📂 Project Structure

```
student_saver-main/
├── backend/                          # FastAPI Python backend
│   ├── alembic/                      # Database migration environment
│   ├── app/
│   │   ├── api/v1/                   # REST API route handlers
│   │   │   ├── auth.py               # Authentication (register, login, tokens)
│   │   │   ├── users.py              # Profile management
│   │   │   ├── categories.py         # Listing categories
│   │   │   ├── listings.py           # CRUD + image upload
│   │   │   ├── wishlist.py           # Save/unsave listings
│   │   │   ├── conversations.py      # Messaging
│   │   │   ├── reservations.py       # Reservation workflow
│   │   │   ├── reviews.py            # Review & rating system
│   │   │   ├── notifications.py      # Notification center
│   │   │   ├── admin.py              # Admin portal routes
│   │   │   └── analytics.py          # Analytics & CSV export
│   │   ├── config/settings.py        # Pydantic settings & env config
│   │   ├── core/security.py          # JWT & bcrypt utilities
│   │   ├── database/                 # SQLAlchemy session & seeder
│   │   ├── dependencies/             # OAuth2 Bearer & DB session DI
│   │   ├── models/                   # ORM models (User, Listing, Review, …)
│   │   ├── repositories/             # Repository pattern data access
│   │   ├── schemas/                  # Pydantic DTOs & response envelopes
│   │   ├── services/                 # Business logic layer
│   │   └── main.py                   # FastAPI app entrypoint
│   ├── uploads/                      # Local file uploads (dev only)
│   ├── .env.example                  # Backend env variable template
│   ├── render.yaml                   # Render.com deployment manifest
│   └── requirements.txt              # Python dependencies
├── src/                              # React + TypeScript frontend
│   ├── components/
│   │   ├── common/                   # LoadingSpinner, ErrorBoundary, EmptyState …
│   │   ├── ui/                       # Button, Card, Badge, Input, Modal …
│   │   ├── auth/                     # AuthCard, AuthHeader, SocialButton …
│   │   ├── dashboard/                # AvatarUploader, ListingCard …
│   │   ├── landing/                  # HeroSection, CtaSection …
│   │   └── marketplace/              # ListingCard, FilterPanel, SearchBar …
│   ├── contexts/                     # AuthContext, ThemeContext, WishlistContext
│   ├── layouts/                      # MainLayout, AuthLayout, DashboardLayout, AdminLayout
│   ├── pages/
│   │   ├── auth/                     # Login, Register, ForgotPassword, ResetPassword
│   │   ├── public/                   # Home, Marketplace, ListingDetail, Categories, About
│   │   ├── dashboard/                # Dashboard, Profile, Wishlist, MyListings, SellItem, Orders, Messages, Notifications, Settings
│   │   └── admin/                    # AdminDashboard (8 tabs)
│   ├── routes/                       # AppRoutes, ProtectedRoute
│   ├── services/api.ts               # Global HTTP fetch wrapper
│   ├── constants/routes.ts           # Centralized route constants
│   └── types/                        # TypeScript interfaces
├── index.html                        # SPA entrypoint with SEO meta tags
├── vercel.json                       # Vercel SPA rewrite config
├── vite.config.ts                    # Vite build config with chunk splitting
└── package.json                      # Frontend dependencies
```

---

## ⚙️ Local Development Setup

### Prerequisites
- **Node.js** ≥ 18.0
- **Python** ≥ 3.12
- **Git**

### 1. Clone the repository
```bash
git clone https://github.com/your-username/campushub.git
cd campushub
```

### 2. Backend Setup (FastAPI)
```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env — no changes needed for local SQLite development

# Run the development server
python -m uvicorn app.main:app --reload --port 8000
```

**Backend URLs:**
- API Root: `http://localhost:8000/`
- Health Check: `http://localhost:8000/api/v1/health`
- Swagger Docs: `http://localhost:8000/api/v1/docs`
- ReDoc: `http://localhost:8000/api/v1/redoc`

> **Note:** No database setup required for local development — the app auto-creates `campushub.db` (SQLite) on first run and seeds default categories automatically.

### 3. Frontend Setup (React + Vite)
```bash
# From project root
npm install

# Copy environment variables
cp .env.example .env
# Edit .env if your backend runs on a different port

# Start the development server
npm run dev
```

**Frontend URL:** `http://localhost:5173/`

---

## 🔐 Environment Variables

### Frontend (`/.env`)
| Variable | Default | Description |
|---|---|---|
| `VITE_APP_ENV` | `development` | Environment name |
| `VITE_APP_NAME` | `CampusHub` | App display name |
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Backend API base URL |
| `VITE_CLOUDINARY_CLOUD_NAME` | — | Cloudinary cloud (optional) |

### Backend (`/backend/.env`)
| Variable | Default | Description |
|---|---|---|
| `APP_ENV` | `development` | `development` or `production` |
| `DATABASE_URL` | `sqlite:///./campushub.db` | Database connection string |
| `SECRET_KEY` | *(see .env.example)* | **Replace in production!** JWT signing secret |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Access token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Refresh token TTL |
| `CLOUDINARY_CLOUD_NAME` | — | Cloudinary credentials |
| `CLOUDINARY_API_KEY` | — | Cloudinary credentials |
| `CLOUDINARY_API_SECRET` | — | Cloudinary credentials |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed frontend URL |
| `ALLOWED_ORIGINS` | *(see .env.example)* | Comma-separated CORS origins |

---

## 📡 API Reference (`/api/v1`)

### 🔐 Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `POST` | `/auth/register` | Register new student account | ❌ |
| `POST` | `/auth/login` | Login and receive JWT tokens | ❌ |
| `GET` | `/auth/me` | Get current authenticated user | ✅ |
| `POST` | `/auth/refresh` | Refresh access token | ✅ |
| `POST` | `/auth/logout` | Invalidate session | ✅ |
| `POST` | `/auth/forgot-password` | Request password reset | ❌ |
| `POST` | `/auth/reset-password` | Complete password reset | ❌ |

### 👤 Users
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/users/profile` | Get own profile | ✅ |
| `PUT` | `/users/profile` | Update profile info | ✅ |
| `POST` | `/users/avatar` | Upload avatar photo | ✅ |
| `POST` | `/users/change-password` | Change account password | ✅ |
| `GET` | `/users/{id}/public` | View another user's public profile | ❌ |

### 📦 Listings
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/listings` | Browse listings (search, filter, paginate) | ❌ |
| `GET` | `/listings/{id}` | Get listing detail | ❌ |
| `POST` | `/listings` | Create new listing | ✅ |
| `PUT` | `/listings/{id}` | Update own listing | ✅ |
| `DELETE` | `/listings/{id}` | Delete own listing | ✅ |
| `POST` | `/listings/upload-images` | Upload listing images | ✅ |

### 🏷 Categories
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/categories` | List all active categories | ❌ |

### ❤️ Wishlist
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/wishlist` | Get saved listings | ✅ |
| `POST` | `/wishlist/{listing_id}` | Save listing | ✅ |
| `DELETE` | `/wishlist/{listing_id}` | Unsave listing | ✅ |

### 💬 Messaging
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/conversations` | List all conversations | ✅ |
| `POST` | `/conversations` | Start a conversation | ✅ |
| `GET` | `/conversations/{id}/messages` | Get messages in thread | ✅ |
| `POST` | `/conversations/{id}/messages` | Send a message | ✅ |

### 📋 Reservations
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/reservations` | List own reservations | ✅ |
| `POST` | `/reservations` | Reserve a listing | ✅ |
| `PUT` | `/reservations/{id}/accept` | Accept reservation (seller) | ✅ |
| `PUT` | `/reservations/{id}/reject` | Reject reservation (seller) | ✅ |
| `PUT` | `/reservations/{id}/cancel` | Cancel reservation (buyer) | ✅ |
| `PUT` | `/reservations/{id}/sold` | Mark listing as sold | ✅ |
| `PUT` | `/reservations/{id}/reopen` | Reopen a listing | ✅ |

### ⭐ Reviews
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `POST` | `/reviews` | Submit a review | ✅ |
| `GET` | `/reviews/my` | Get reviews I've received | ✅ |
| `GET` | `/reviews/user/{id}` | Get public reviews for user | ❌ |

### 🔔 Notifications
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/notifications` | List notifications (paginated) | ✅ |
| `POST` | `/notifications/{id}/read` | Mark one as read | ✅ |
| `POST` | `/notifications/read-all` | Mark all as read | ✅ |
| `DELETE` | `/notifications/{id}` | Delete a notification | ✅ |

### 🛡 Admin (Role: `admin` required)
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/admin/dashboard` | Platform KPI metrics | 🔒 |
| `GET` | `/admin/users` | List all users | 🔒 |
| `PUT` | `/admin/users/{id}` | Update user (verify/ban) | 🔒 |
| `GET` | `/admin/listings` | Audit all listings | 🔒 |
| `PUT` | `/admin/listings/{id}` | Override listing status | 🔒 |
| `GET` | `/admin/categories` | List categories | 🔒 |
| `POST` | `/admin/categories` | Create category | 🔒 |
| `DELETE` | `/admin/categories/{id}` | Delete category | 🔒 |
| `GET` | `/admin/reports` | View moderation reports | 🔒 |
| `PUT` | `/admin/reports/{id}` | Resolve/dismiss report | 🔒 |
| `GET` | `/admin/activity` | Admin audit log | 🔒 |
| `GET` | `/admin/settings` | Get platform settings | 🔒 |
| `PUT` | `/admin/settings` | Update platform settings | 🔒 |

### 📊 Analytics (Role: `admin` required)
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/admin/analytics` | Summary KPI metrics | 🔒 |
| `GET` | `/admin/analytics/users` | User growth & distribution | 🔒 |
| `GET` | `/admin/analytics/listings` | Listing stats by category | 🔒 |
| `GET` | `/admin/analytics/reservations` | Conversion funnel | 🔒 |
| `GET` | `/admin/analytics/reviews` | Rating distribution | 🔒 |
| `GET` | `/admin/analytics/reports` | Report breakdown | 🔒 |
| `GET` | `/admin/export/users` | CSV export — Users | 🔒 |
| `GET` | `/admin/export/listings` | CSV export — Listings | 🔒 |
| `GET` | `/admin/export/reservations` | CSV export — Reservations | 🔒 |
| `GET` | `/admin/export/reviews` | CSV export — Reviews | 🔒 |

### ❤️ Health
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `GET` | `/` | Root health check | ❌ |
| `GET` | `/api/v1/health` | Detailed health endpoint | ❌ |

---

## 🗄 Database

### ORM Models
| Model | Key Fields |
|---|---|
| `User` | `id`, `email`, `hashed_password`, `full_name`, `college`, `role`, `is_verified`, `avatar_url` |
| `Category` | `id`, `name`, `icon`, `is_active` |
| `Listing` | `id`, `title`, `price`, `condition`, `status`, `category_id`, `seller_id`, `images`, `attributes` |
| `Wishlist` | `id`, `user_id`, `listing_id` |
| `Message` | `id`, `conversation_id`, `sender_id`, `content`, `is_read` |
| `Reservation` | `id`, `listing_id`, `buyer_id`, `seller_id`, `status` |
| `Review` | `id`, `reservation_id`, `reviewer_id`, `reviewee_id`, `rating`, `comment` |
| `Notification` | `id`, `user_id`, `type`, `title`, `message`, `is_read`, `related_id` |
| `Report` | `id`, `reporter_id`, `target_listing_id`, `reason`, `status` |
| `AdminActivity` | `id`, `admin_id`, `action`, `target_type`, `target_id`, `details` |

### Local Development (SQLite)
No setup needed. The app auto-creates `backend/campushub.db` and seeds 12 default categories on first run.

### Production (Supabase PostgreSQL)
1. Create a project at [supabase.com](https://supabase.com)
2. Copy the **Connection String** from `Project Settings → Database`
3. Set `DATABASE_URL=<connection string>` in your Render environment variables
4. Run migrations: `alembic upgrade head`

---

## 🌐 Production Deployment

### Frontend → Vercel
1. Push your repository to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite — no framework config needed
4. Add environment variable: `VITE_API_URL = https://campushub-api.onrender.com/api/v1`
5. Click **Deploy** — `vercel.json` handles SPA rewrites automatically

### Backend → Render
1. Go to [render.com](https://render.com) → New → **Blueprint**
2. Connect your GitHub repository
3. Render reads `backend/render.yaml` automatically
4. Set secret env vars in the Render dashboard:
   - `DATABASE_URL` (Supabase connection string)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
5. Click **Apply** — service starts with health checks on `/api/v1/health`

### Storage → Cloudinary
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Navigate to **Dashboard** → copy your Cloud Name, API Key, API Secret
3. Add them to both the Render dashboard and local `.env`

### Production Checklist
- [ ] `SECRET_KEY` is a unique 32+ character random string (auto-generated by Render)
- [ ] `DATABASE_URL` points to Supabase, not SQLite
- [ ] `ALLOWED_ORIGINS` includes your Vercel domain
- [ ] `APP_ENV=production` set on Render
- [ ] Cloudinary keys configured for image uploads
- [ ] Health check `GET /api/v1/health` returns `200 OK`
- [ ] `npm run build` passes with 0 TypeScript errors

---

## 🔒 Security

- **Authentication:** JWT access tokens (30 min TTL) + refresh tokens (7 days)
- **Password Storage:** bcrypt hashing via Passlib
- **SQL Injection:** Protected by SQLAlchemy ORM parameterized queries
- **Authorization:** OAuth2 Bearer token dependency on all protected routes; admin role check on all `/admin` routes
- **Response Headers:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `X-XSS-Protection` on every response
- **CORS:** Strict origin allowlist configurable via environment variable
- **Error Handling:** Production mode never leaks stack traces — generic 500 messages only

---

## 🚀 Future Scope

- **WebSockets** — Real-time chat and live notifications
- **Email Notifications** — Transactional emails via SendGrid
- **Push Notifications** — PWA-style browser push
- **AI Listing Assistant** — Auto-fill title/description/price suggestions
- **Payment Integration** — Stripe escrow for secure transactions
- **Native Mobile App** — React Native version
- **Multi-language (i18n)** — Internationalization support
- **Seller Verification Badges** — Identity-verified listings

---

## 📜 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<p align="center">Built with ❤️ for university students everywhere.</p>
