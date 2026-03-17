# 📚 Spiritual Library - Manfusaa

A modern, multi-language digital library for spiritual and theological manuscripts. This application allows seekers to browse, search, and study sacred texts across multiple languages with a premium, focused user experience.

---

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern UI library.
- **Redux Toolkit**: Centralized state management for books, auth, and languages.
- **i18next**: Sophisticated multi-language orchestration.
- **Lucide React**: Premium iconography.
- **Vanilla CSS**: Custom design system for a unique aesthetic.

### Backend
- **Node.js & Express**: Scalable API architecture.
- **Prisma ORM**: Type-safe database interactions.
- **PostgreSQL**: Robust relational data storage.
- **JWT**: Secure token-based authentication.

---

## ✨ Core Features

- **🌐 Multi-Language Ecosystem**: Full support for English, Arabic, Amharic, and Afan Oromo, including RTL (Right-to-Left) layout support.
- **🔍 Intelligent Filtering**: Category-based filtering and real-time search across authors, titles, and ISBNs.
- **💎 Premium UX**: Focused authentication pages, smooth transitions, and a glassmorphism-based design system.
- **🛡️ Secure Access**: Robust route protection with server-side identity verification and role-based access control (Admin/User).
- **📊 Admin Portal**: Comprehensive dashboard for managing manuscripts, categories, and users.
- **📖 Study Tools**: Direct PDF reading, manuscript downloads, and external source linking.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL Database

### 1. Database Setup
1. Create a `.env` file in the `backend` directory.
2. Add your database connection string: `DATABASE_URL="postgresql://user:password@localhost:5432/db_name"`
3. Push the schema: `npx prisma db push`
4. Seed the database: `npm run prisma:seed`

### 2. Backend Installation
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```

---

## 📬 Contact

**Tayes Sirnesa**  
📧 Email: tayesirnesa430@gmail.com

---
⭐ Ported with care for spiritual seekers.
