# 📚 Book Library - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Current Features](#current-features)
5. [Installation & Setup](#installation--setup)
6. [Development Guidelines](#development-guidelines)
7. [Recommended Features](#recommended-features)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Book Library** is a comprehensive web application for managing and browsing books online. The system provides a complete solution for libraries and bookstores, featuring multi-language support, book borrowing management, user authentication, and administrative controls.

### Key Capabilities
- Browse and search books with advanced filters
- Multi-language content support (English, Arabic, Amharic, Oromo)
- Book borrowing and return tracking
- User role management (Admin/User)
- Book inventory management
- Category and author management
- RTL language support for Arabic

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma (recommended) / Sequelize (legacy)
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Security**: Helmet, bcryptjs, express-rate-limit
- **File Upload**: Multer
- **Logging**: Winston
- **HTTP Tools**: CORS, Morgan

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Internationalization**: i18next
- **HTTP Client**: Axios

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**: ESLint
- **Testing**: Jest (backend), Vitest (frontend - recommended)

---

## System Architecture

### Backend Structure
```
backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Database schema definition
│   └── seed.js              # Database seeding
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.js            # Database connection
│   │   ├── env.js           # Environment variables
│   │   ├── logger.js        # Logging configuration
│   │   └── prisma.js        # Prisma client instance
│   ├── controllers/         # Request handlers
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── author.controller.js
│   │   ├── book.controller.js
│   │   ├── borrow.controller.js
│   │   ├── category.controller.js
│   │   ├── language.controller.js
│   │   └── user.controller.js
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── error.middleware.js     # Error handling
│   │   ├── role.middleware.js      # Role-based access
│   │   └── validate.middleware.js  # Request validation
│   ├── models/              # Data models (Sequelize - legacy)
│   ├── routes/              # API routes
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── author.routes.js
│   │   ├── book.routes.js
│   │   ├── borrow.routes.js
│   │   ├── category.routes.js
│   │   ├── index.js         # Main router
│   │   ├── language.routes.js
│   │   └── user.routes.js
│   ├── services/            # Business logic
│   │   ├── auth.service.js
│   │   ├── book.service.js
│   │   ├── language.service.js
│   │   └── user.service.js
│   ├── utils/               # Helper functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── response.js
│   ├── validators/          # Joi schemas
│   │   ├── auth.validator.js
│   │   └── book.validator.js
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
└── tests/                   # Test files
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                 # App configuration
│   │   ├── rootReducer.js   # Redux root reducer
│   │   ├── routes.jsx       # Route definitions
│   │   └── store.js         # Redux store
│   ├── features/            # Feature modules
│   │   ├── admin/           # Admin dashboard
│   │   │   └── pages/
│   │   ├── auth/            # Authentication
│   │   │   ├── pages/
│   │   │   └── services/
│   │   ├── books/           # Book management
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   ├── languages/       # Language switching
│   │   │   ├── components/
│   │   │   └── services/
│   │   └── users/           # User profile
│   │       ├── pages/
│   │       └── userSlice.js
│   ├── i18n/                # Translations
│   │   ├── am.json          # Amharic
│   │   ├── ar.json          # Arabic
│   │   ├── en.json          # English
│   │   ├── om.json          # Oromo
│   │   └── index.js
│   ├── shared/              # Shared resources
│   │   ├── components/      # Reusable components
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SubNavbar.jsx
│   │   │   └── TopBar.jsx
│   │   ├── hooks/           # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   └── useDebounce.js
│   │   ├── layout/          # Layout components
│   │   │   ├── AdminLayout.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── services/        # API layer
│   │   │   ├── apiEndpoints.js
│   │   │   └── axiosInstance.js
│   │   ├── styles/          # Global styles
│   │   │   ├── global.css
│   │   │   └── variables.css
│   │   └── utils/           # Utilities
│   │       ├── constants.js
│   │       ├── formatters.js
│   │       └── storage.js
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
└── public/                  # Static assets
```

---

## Current Features

### ✅ Implemented Features

#### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes
- Password hashing with bcrypt

#### Book Management
- Create, Read, Update, Delete (CRUD) operations
- Multi-language book information
- Book translations per language
- ISBN tracking
- Quantity management
- Featured books highlighting
- View counter
- Cover image upload
- File/ebook upload support
- External URL linking

#### Search & Discovery
- Text search (title, author)
- Filter by category
- Filter by author
- Filter by language
- Pagination support
- Debounced search

#### Borrowing System
- Issue books to users
- Track due dates
- Return processing
- Overdue detection
- Fine calculation
- Borrowing history

#### User Management
- User profiles
- Preferred language setting
- Role assignment
- Active/inactive status
- Phone number tracking

#### Administrative Features
- Dashboard with statistics
- User management interface
- Book management interface
- Borrowing management
- Category management
- Author management
- Language management
- System settings
- Reports generation

#### Internationalization (i18n)
- English (default, LTR)
- Arabic (RTL support)
- Amharic
- Oromo
- Language switcher component
- Persistent language preference

#### UI/UX Features
- Responsive design (mobile-first)
- Tailwind CSS styling
- Loading states
- Error handling
- Toast notifications
- Form validation
- Image lazy loading
- Custom icons (Lucide)

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file based on .env.example
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://user:password@localhost:5432/book_library
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   UPLOAD_DIR=./uploads
   ```

5. **Setup database with Prisma**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database (optional)
   npx prisma db seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Running Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm run test
```

---

## Development Guidelines

### Code Style

#### Backend (Node.js/Express)
- Use ES6+ syntax where possible
- Async/await for asynchronous operations
- Consistent error handling with try-catch
- Use middleware for cross-cutting concerns
- Follow MVC pattern
- Validate all incoming requests

#### Frontend (React)
- Functional components with hooks
- Redux Toolkit for state management
- Custom hooks for reusable logic
- PropTypes or TypeScript for type safety
- Component composition over inheritance
- Lazy loading for code splitting

### Naming Conventions

**Files:**
- Backend: `kebab-case.js` (e.g., `user.controller.js`)
- Frontend: `PascalCase.jsx` for components, `camelCase.js` for utilities

**Variables & Functions:**
- Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Classes/Components: `PascalCase`
- Private methods: `_leadingUnderscore`

### Git Workflow

```bash
# Feature branch
git checkout -b feature/new-feature-name

# Commit messages (conventional commits)
git commit -m "feat: add new search filter"
git commit -m "fix: resolve pagination bug"
git commit -m "docs: update API documentation"

# Before pushing
git pull origin main --rebase
git push origin feature/new-feature-name
```

### Database Migrations

**Creating a new migration:**
```bash
npx prisma migrate dev --name description_of_change
```

**Resetting database (development only):**
```bash
npx prisma migrate reset
```

---

## Recommended Features

### 🔥 High Priority Features

#### 1. Email Notification System
**Description**: Automated email notifications for borrowing reminders, overdue notices, and system updates.

**Implementation:**
```javascript
// Suggested tech stack:
- Nodemailer (email sending)
- Bull/Agenda (job scheduling)
- Handlebars/Pug (email templates)
```

**Features:**
- Due date reminders (3 days before)
- Overdue notifications
- Welcome emails for new users
- Password reset emails
- Book availability alerts

**Estimated Time**: 2-3 days

---

#### 2. Advanced Search & Filtering
**Description**: Enhanced search capabilities with multiple criteria and sorting options.

**Features:**
- Multi-field search (title, author, ISBN, description)
- Advanced filters:
  - Publication year range
  - Language selection (multiple)
  - Category selection (multiple)
  - Availability status
  - Price range (if applicable)
- Sorting options:
  - Newest first
  - Most popular (views)
  - Title (A-Z, Z-A)
  - Author name
- Saved searches
- Search history

**API Endpoint Enhancement:**
```javascript
GET /api/books/search
Query params:
  - q (search query)
  - categories (array)
  - languages (array)
  - authors (array)
  - publishedFrom (date)
  - publishedTo (date)
  - available (boolean)
  - sortBy (field)
  - sortOrder (asc|desc)
```

**Estimated Time**: 3-4 days

---

#### 3. Book Reviews & Ratings
**Description**: Allow users to review and rate books they've borrowed.

**Database Schema:**
```prisma
model Review {
  id        Int      @id @default(autoincrement())
  bookId    Int
  userId    Int
  rating    Int      // 1-5 stars
  comment   String?
  isApproved Boolean @default(false)
  createdAt DateTime @default(now())
  
  book Book @relation(fields: [bookId], references: [id])
  user User @relation(fields: [userId], references: [id])
  
  @@unique([bookId, userId])
}
```

**Features:**
- 5-star rating system
- Written reviews
- Admin approval workflow
- Display average rating on book details
- Review moderation
- Helpful/not helpful voting

**Estimated Time**: 2-3 days

---

#### 4. Book Reservation System
**Description**: Allow users to reserve books that are currently unavailable.

**Features:**
- Reserve button for unavailable books
- Queue management (first-come-first-served)
- Automatic notification when book becomes available
- Reservation expiration (24-48 hours to pick up)
- Reservation limits per user
- Reservation history

**Database Enhancement:**
```prisma
model Reservation {
  id         Int             @id @default(autoincrement())
  bookId     Int
  userId     Int
  status     ReservationStatus @default(PENDING)
  notifiedAt DateTime?
  expiresAt  DateTime
  createdAt  DateTime @default(now())
}
```

**Estimated Time**: 2-3 days

---

#### 5. Reading History & Statistics
**Description**: Track user reading activity and provide personal statistics.

**Features:**
- Books read count
- Reading streak tracking
- Favorite genres/categories]
- Monthly reading summary
- Reading goal setting (books per year)
- Achievement badges
- Export reading history

**User Dashboard Additions:**
- Currently reading
- Want to read list
- Read history timeline
- Statistics charts

**Estimated Time**: 3-4 days

---

#### 6. Wishlist Feature
**Description**: Users can maintain a wishlist of books they want to read.

**Features:**
- Add/remove books to wishlist
- Priority ranking
- Move from wishlist to borrowing
- Email notification if wishlisted book becomes available
- Share wishlist (optional)

**Database:**
```prisma
model Wishlist {
  id        Int      @id @default(autoincrement())
  userId    Int
  bookId    Int
  priority  Int      @default(1)
  createdAt DateTime @default(now())
  
  @@unique([userId, bookId])
}
```

**Estimated Time**: 1-2 days

---

### 🚀 Medium Priority Features

#### 7. eBook Reader Integration
**Description**: Built-in PDF/ePub reader for digital books.

**Features:**
- In-browser PDF viewer
- Bookmarking
- Note-taking
- Highlight text
- Reading progress tracking
- Offline reading (PWA)
- Adjustable font size/theme

**Tech Stack:**
- PDF.js or React-PDF
- LocalStorage for bookmarks
- PWA for offline support

**Estimated Time**: 5-7 days

---

#### 8. Recommendation Engine
**Description**: Suggest books based on user preferences and behavior.

**Features:**
- "Similar books" section
- "Because you read X" recommendations
- Trending books in your favorite categories
- Collaborative filtering (users who liked this also liked...)
- Personalized homepage

**Algorithm Approaches:**
- Content-based (category, author, language)
- Collaborative filtering
- Popularity-based
- Hybrid approach

**Estimated Time**: 4-6 days

---

#### 9. Social Features
**Description**: Enable social interaction around books.

**Features:**
- Book clubs/groups
- Discussion forums per book
- Share to social media
- Friend system
- Activity feed
- Book lending between users
- Reading challenges with friends

**Estimated Time**: 5-7 days

---

#### 10. Admin Analytics Dashboard
**Description**: Comprehensive analytics for library administrators.

**Features:**
- Borrowing trends (daily, weekly, monthly)
- Most popular books
- User activity metrics
- Revenue tracking (if fines/fees apply)
- Inventory reports
- Export to CSV/PDF
- Interactive charts (Chart.js/Recharts)
- Real-time statistics

**Metrics to Track:**
- Total active users
- Books borrowed today/week/month
- Overdue books
- Popular categories
- Peak borrowing times
- User growth rate

**Estimated Time**: 4-5 days

---

#### 11. Bulk Import/Export
**Description**: Import books from CSV/Excel and export library data.

**Features:**
- CSV/Excel import template
- Batch book creation
- Image URL import for covers
- Validation before import
- Duplicate detection
- Export entire library catalog
- Export user data (GDPR compliance)

**Tech Stack:**
- xlsx or csv-parser
- Multer for file upload
- Background job processing

**Estimated Time**: 2-3 days

---

#### 12. Multi-language Content Expansion
**Description**: Add more languages and improve localization.

**Languages to Add:**
- French
- Spanish
- German
- Chinese
- Hindi

**Features:**
- User-contributed translations
- Translation management interface
- Auto-translate suggestions (Google Translate API)
- RTL support improvements

**Estimated Time**: 3-4 days

---

### 💡 Low Priority (Nice to Have)

#### 13. Mobile App
**Description**: Native mobile applications (iOS/Android).

**Approach:**
- React Native (code reuse with web)
- Flutter (better performance)
- Progressive Web App (PWA) as intermediate step

**Estimated Time**: 3-4 weeks

---

#### 14. Audiobook Support
**Description**: Support for audio format books.

**Features:**
- Audio player integration
- Playback speed control
- Bookmarking
- Download for offline listening
- Sleep timer

**Estimated Time**: 3-4 days

---

#### 15. Gamification
**Description**: Game-like elements to encourage reading.

**Features:**
- Reading challenges
- Achievement badges
- Leaderboards
- Points/rewards system
- Level progression
- Virtual bookshelf showcase

**Estimated Time**: 4-5 days

---

#### 16. Integration with External APIs
**Description**: Enrich book data from external sources.

**Possible Integrations:**
- Google Books API (auto-fill book details)
- Open Library API
- Goodreads API (import reviews/ratings)
- ISBN databases

**Estimated Time**: 2-3 days per integration

---

#### 17. Dark Mode
**Description**: System-wide dark theme option.

**Features:**
- Toggle in settings
- Auto-switch based on system preference
- Persist user choice
- Smooth transitions

**Estimated Time**: 1 day

---

#### 18. Chatbot/Virtual Assistant
**Description**: AI-powered help for finding books.

**Features:**
- Natural language queries
- Book recommendations
- FAQ automation
- Borrowing assistance
- Integration with messaging platforms

**Tech Stack:**
- Dialogflow or Rasa
- Custom NLP model

**Estimated Time**: 1-2 weeks

---

## API Reference

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

```http
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
POST   /api/auth/logout            Logout user
GET    /api/auth/me                Get current user
PUT    /api/auth/password          Change password
POST   /api/auth/forgot-password   Request password reset
POST   /api/auth/reset-password    Reset password
```

### Book Endpoints

```http
GET    /api/books                  Get all books (paginated)
GET    /api/books/:id              Get book by ID
GET    /api/books/slug/:slug       Get book by slug
GET    /api/books/search           Search books
POST   /api/books                  Create book (Admin)
PUT    /api/books/:id              Update book (Admin)
DELETE /api/books/:id              Delete book (Admin)
POST   /api/books/:id/cover        Upload cover image
POST   /api/books/:id/file         Upload ebook file
```

### Borrowing Endpoints

```http
GET    /api/borrows                Get user's borrows
GET    /api/borrows/:id            Get borrow details
POST   /api/borrows                Borrow a book
PUT    /api/borrows/:id/return     Return a book
GET    /api/borrows/overdue        Get overdue books (Admin)
```

### User Endpoints

```http
GET    /api/users                  Get all users (Admin)
GET    /api/users/:id              Get user by ID (Admin)
PUT    /api/users/:id              Update user
DELETE /api/users/:id              Delete user (Admin)
GET    /api/users/:id/borrows      Get user's borrowing history
```

### Category Endpoints

```http
GET    /api/categories             Get all categories
POST   /api/categories             Create category (Admin)
PUT    /api/categories/:id         Update category (Admin)
DELETE /api/categories/:id         Delete category (Admin)
```

### Author Endpoints

```http
GET    /api/authors                Get all authors
GET    /api/authors/:id            Get author details
POST   /api/authors                Create author (Admin)
PUT    /api/authors/:id            Update author (Admin)
DELETE /api/authors/:id            Delete author (Admin)
```

### Language Endpoints

```http
GET    /api/languages              Get all languages
POST   /api/languages              Create language (Admin)
PUT    /api/languages/:id          Update language (Admin)
DELETE /api/languages/:id          Delete language (Admin)
```

### Admin Endpoints

```http
GET    /api/admin/dashboard        Dashboard statistics
GET    /api/admin/reports          Generate reports
GET    /api/admin/settings         Get system settings
PUT    /api/admin/settings         Update system settings
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [ ... ]
  }
}
```

### HTTP Status Codes

```
200 OK - Successful request
201 Created - Resource created successfully
204 No Content - Successful deletion
400 Bad Request - Invalid request data
401 Unauthorized - Authentication required
403 Forbidden - Insufficient permissions
404 Not Found - Resource not found
409 Conflict - Resource already exists
422 Unprocessable Entity - Validation error
429 Too Many Requests - Rate limit exceeded
500 Internal Server Error - Server error
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Problem**: Cannot connect to PostgreSQL

**Solutions:**
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check DATABASE_URL in `.env` file
- Ensure database exists: `psql -U postgres -l`
- Check firewall settings for port 5432
- Verify credentials are correct

---

#### 2. Prisma Migration Errors

**Problem**: Migration fails or conflicts

**Solutions:**
```bash
# Reset migrations (development only)
npx prisma migrate reset

# Fix existing database
npx prisma migrate resolve --applied "migration_name"

# Regenerate Prisma Client
npx prisma generate

# Check schema validity
npx prisma validate
```

---

#### 3. JWT Token Errors

**Problem**: "Token expired" or "Invalid token"

**Solutions:**
- Clear browser localStorage/cookies
- Re-login to get fresh token
- Check JWT_SECRET matches in environment
- Verify token expiration time is reasonable (7d default)

---

#### 4. File Upload Issues

**Problem**: Cannot upload book covers or files

**Solutions:**
- Check UPLOAD_DIR exists and has write permissions
- Verify file size doesn't exceed limit (default: 5MB)
- Check allowed file types in multer configuration
- Ensure proper MIME types are configured

---

#### 5. CORS Errors (Frontend)

**Problem**: CORS policy blocking requests

**Solutions:**
```javascript
// backend/src/app.js
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

---

#### 6. Port Already in Use

**Problem**: EADDRINUSE - Port 5000 already in use

**Solutions:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

---

#### 7. Build Errors (Frontend)

**Problem**: Vite build fails

**Solutions:**
```bash
# Clear cache
rm -rf node_modules/.vite

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (should be 18+)
node --version

# Build with verbose output
npm run build --debug
```

---

#### 8. Slow Performance

**Problem**: Application is slow

**Solutions:**
- Add database indexes on frequently queried fields
- Implement caching (Redis)
- Optimize images (compress book covers)
- Enable gzip compression in Express
- Use CDN for static assets
- Implement pagination for large lists
- Profile slow queries with Prisma query logging

---

### Debugging Tips

**Backend Debugging:**
```javascript
// Enable detailed logging
NODE_ENV=development LOG_LEVEL=debug npm run dev

// Prisma query logging
npx prisma studio
```

**Frontend Debugging:**
```javascript
// Redux DevTools
// Install Redux DevTools Extension
// Access via browser devtools

// React Developer Tools
// Install React DevTools extension
```

**Database Debugging:**
```sql
-- View active connections
SELECT * FROM pg_stat_activity;

-- Slow query log
ALTER SYSTEM SET log_min_duration_statement = 1000;
```

---

## Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

### Pull Request Guidelines

- Follow code style guidelines
- Write clear commit messages
- Include tests for new features
- Update documentation
- Describe changes in PR description
- Link related issues

---

## License

This project is proprietary software. All rights reserved.

---

## Contact & Support

**Email**: tayesirnesa430@gmail.com

**Support Hours**: Monday - Friday, 9 AM - 5 PM

For technical support or questions, please email with subject line: "[Book Library] Your Question"

---

## Version History

### v1.0.0 (Current)
- Initial release
- Book CRUD operations
- User authentication
- Borrowing system
- Multi-language support
- Admin dashboard

### Planned Versions

**v1.1.0** (Next Release)
- Email notifications
- Advanced search
- Book reviews
- Reservation system

**v1.2.0**
- Reading history
- Wishlist
- Analytics dashboard
- Bulk import/export

---

*Last Updated: March 17, 2026*
