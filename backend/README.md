# CampusHub Backend Architecture & Database Blueprint

Production-ready backend architecture for **CampusHub** built with **FastAPI, PostgreSQL, SQLAlchemy ORM, Pydantic v2, and Alembic**.

---

## 🏗 Directory Architecture

```
backend/
├── alembic/                      # Alembic database migration environment
├── app/
│   ├── api/                      # REST API endpoints (v1)
│   │   └── v1/                   # auth, users, categories, listings, wishlist, admin
│   ├── config/                   # Pydantic environment configuration
│   ├── core/                     # JWT tokens & Security utilities
│   ├── database/                 # SQLAlchemy Engine & Session
│   ├── dependencies/             # Fast API Dependency Injections
│   ├── middleware/               # CORS & Exception response wrappers
│   ├── models/                   # SQLAlchemy ORM Database Models
│   ├── repositories/             # Repository Pattern Data Access Layer
│   ├── schemas/                  # Pydantic Request/Response DTOs
│   ├── services/                 # Business Logic Service Abstractions
│   └── main.py                   # FastAPI Application Entrypoint
├── .env.example                  # Environment Variables Template
├── alembic.ini                   # Alembic Migration Config
├── render.yaml                   # Infrastructure-as-Code for Render Web Service
├── requirements.txt              # Backend Dependencies
└── README.md                     # Architecture Documentation & API Contracts
```

---

## 🗄 Database Schema & Entity Relationships

### Tables Summary

1. **`users`**:
   - `id` (PK, Integer, Auto-increment)
   - `full_name` (String, Not Null)
   - `email` (String, Unique, Index, Not Null)
   - `password_hash` (String, Not Null)
   - `college` (String, Not Null)
   - `department` (String, Nullable)
   - `academic_year` (String, Nullable)
   - `role` (String, Default 'user')
   - `avatar` (String, Nullable)
   - `is_verified` (Boolean, Default False)
   - `created_at` / `updated_at` (Timestamp)

2. **`categories`**:
   - `id` (PK, Integer)
   - `name` (String, Unique)
   - `slug` (String, Unique, Index)
   - `icon` (String, Nullable)
   - `is_active` (Boolean, Default True)

3. **`listings`**:
   - `id` (PK, Integer)
   - `title` (String, Index)
   - `description` (Text)
   - `price` (Numeric(10,2))
   - `status` (String: `active`, `reserved`, `sold`, `archived`)
   - `condition` (String: `Brand New`, `Like New`, `Good`, `Fair`)
   - `category_id` (FK -> `categories.id`)
   - `seller_id` (FK -> `users.id`)
   - `attributes` (JSONB - dynamic attributes for ISBN, author, course code, specs)
   - `created_at` / `updated_at` (Timestamp)

4. **`listing_images`**:
   - `id` (PK, Integer)
   - `listing_id` (FK -> `listings.id`)
   - `image_url` (String)
   - `sort_order` (Integer, Default 0)

5. **`wishlist`**:
   - `id` (PK, Integer)
   - `user_id` (FK -> `users.id`)
   - `listing_id` (FK -> `listings.id`)
   - `created_at` (Timestamp)

6. **`messages`** & **`notifications`**:
   - Schema defined for Phase 2/3 chat and alert extensions.

---

## 🔐 Authentication Flow Architecture

```
Register (.edu email)
       ↓
Email Verification Link
       ↓
Sign In Credentials Check
       ↓
Issue JWT Access Token (30m) & Refresh Token (7d)
       ↓
Bearer Auth on Protected Endpoints
       ↓
Token Refresh / Logout
```

---

## 📑 Standardized Response Envelope

### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response (`400`, `401`, `404`, `500`)
```json
{
  "success": false,
  "message": "Listing not found.",
  "errors": []
}
```

---

## 🚀 Deployment Guide

### 1. Database: Supabase PostgreSQL
- Create a PostgreSQL project on Supabase.
- Copy Database connection string into `DATABASE_URL`.

### 2. Backend API: Render Web Service (`render.yaml`)
- Connect repository to Render.
- Render automatically reads `render.yaml` and deploys the FastAPI application with Uvicorn.

### 3. Frontend: Vercel
- Deploy React Vite frontend to Vercel and configure `VITE_API_URL` to point to Render API endpoint.
