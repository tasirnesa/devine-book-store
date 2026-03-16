# Spiritual Book Library — Backend API

Express.js REST API for the multilingual spiritual book library.

## Stack
- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL via Sequelize ORM
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: Joi
- **Logging**: Winston
- **File Upload**: Multer

---

## Getting Started

```bash
cd backend

# Install dependencies
npm install

# Copy env file and fill in your values
cp .env.example .env

# Start in development mode (auto-reload)
npm run dev
```

Server starts at: `http://localhost:5000`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | - | Health check |
| GET | `/api/books` | - | List books (paginated, filtered) |
| GET | `/api/books/search?q=&lang=` | - | Search books |
| GET | `/api/books/:slug` | - | Get book detail |
| POST | `/api/books` | Admin | Create book |
| PUT | `/api/books/:id` | Admin | Update book |
| DELETE | `/api/books/:id` | Admin | Delete book |
| GET | `/api/languages` | - | List all languages |
| POST | `/api/languages` | Admin | Add language |
| PUT | `/api/languages/:id` | Admin | Update language |
| DELETE | `/api/languages/:id` | Admin | Delete language |
| POST | `/api/auth/register` | - | Register user |
| POST | `/api/auth/login` | - | Login |
| GET | `/api/auth/me` | JWT | Get current user |
| POST | `/api/auth/logout` | JWT | Logout |
| GET | `/api/users` | Admin | List users |
| GET | `/api/users/:id` | JWT | Get user |
| PUT | `/api/users/:id` | JWT | Update profile |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## Query Parameters (Books)

| Param | Type | Description |
|-------|------|-------------|
| `lang` | string | Language code (`en`, `ar`, `am`, `om`) |
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Items per page (default: 20) |
| `category` | string | Category slug filter |
| `q` | string | Search keyword (search endpoint) |

---

## Project Structure

```
src/
  config/      - db, env, logger
  models/      - Sequelize models (Book, BookTranslation, Language, User)
  services/    - Business logic
  controllers/ - Request/response handlers
  routes/      - Express routers
  middlewares/ - auth, role, validation, error
  validators/  - Joi schemas
  utils/       - response helpers, constants, helpers
  app.js       - Express app setup
  server.js    - Entry point
```

---

## Multilingual Design

Books use a **translation table** pattern:
- `books` — language-agnostic base record (slug, cover, file, featured)
- `book_translations` — one row per language per book (title, description, authorName)

This allows the same book to appear in Arabic, English, Amharic, and Afan Oromo without data duplication.
