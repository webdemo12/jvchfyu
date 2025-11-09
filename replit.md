# Tiger Super Satta Results Website

## Overview

This is a lottery/gaming results website called "Tiger Super Satta" built with a modern full-stack architecture. The application allows users to view live lottery results, browse previous results by date, submit contact inquiries, and provides an admin panel for managing game results. The design emphasizes trust, cultural relevance (traditional deity imagery, auspicious colors), and mobile-first accessibility for the primary user base.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- Shadcn UI component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming support (light/dark mode capability)
- Custom spacing units (3, 4, 6, 8, 12, 16) for consistent visual rhythm
- Typography hierarchy using Inter/Poppins for headings, JetBrains Mono for monospaced numbers

**Design Principles**
- Mobile-first responsive design (primary breakpoint at 768px)
- Trust-focused professional appearance with clear branding
- Cultural relevance through traditional visual elements
- Data clarity with high-contrast typography and spacing

**State Management**
- React Query for server state (results data, admin operations)
- React Hook Form with Zod validation for form handling
- Cookie-based authentication state management

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the REST API server
- Cookie-parser middleware for session management
- Custom logging middleware for API request/response tracking

**API Design**
- RESTful API endpoints prefixed with `/api`
- Admin authentication routes (`/api/admin/login`, `/api/admin/logout`, `/api/admin/me`)
- Game results management endpoints
- Contact form submission endpoints
- JWT-based authentication with cookie storage

**Authentication & Authorization**
- JWT tokens stored in HTTP-only cookies for security
- bcrypt.js for password hashing
- Token-based password reset flow with expiry
- Admin-only routes protected by authenticateToken middleware

**Data Layer**
- Drizzle ORM for type-safe database queries
- Neon serverless PostgreSQL as the database provider
- WebSocket support for real-time database connections
- Schema-driven development with automatic type inference

### Database Schema

**Tables**
1. **admins** - Admin user accounts
   - id (UUID primary key)
   - username (unique)
   - password (bcrypt hashed)
   - resetToken, resetTokenExpiry (for password resets)
   - createdAt timestamp

2. **gameResults** - Lottery game results
   - id (UUID primary key)
   - date (text)
   - time (text) 
   - number (text) - the lottery number result
   - createdAt, updatedAt timestamps

3. **contactSubmissions** - User contact form submissions
   - id (UUID primary key)
   - name, phone, email, message
   - createdAt timestamp

**Validation**
- Zod schemas generated from Drizzle table definitions
- Runtime validation for all insert operations
- Type safety between database and application code

### Build & Deployment

**Development Mode**
- Vite dev server with HMR for frontend
- tsx for running TypeScript server code directly
- Concurrent client and server development

**Production Build**
- Vite builds optimized React bundle to `dist/public`
- esbuild bundles server code to `dist/index.js`
- ESM module format throughout the application
- Static asset serving from built client directory

**Environment Configuration**
- DATABASE_URL for Neon PostgreSQL connection
- SESSION_SECRET for JWT signing (defaults to 'tiger-satta-secret-key')
- NODE_ENV for environment detection

## External Dependencies

### Third-Party Services

**Database**
- Neon Serverless PostgreSQL - Cloud-hosted PostgreSQL database with WebSocket support
- Connection via @neondatabase/serverless package
- Supports connection pooling and serverless scaling

**UI Component Libraries**
- Radix UI - Unstyled, accessible component primitives (40+ components)
- Shadcn UI - Pre-styled component patterns built on Radix
- Lucide React - Icon library for UI elements

**Development Tools**
- Replit plugins for development experience (vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner)

### Key NPM Packages

**Frontend**
- `react`, `react-dom` - UI framework
- `@tanstack/react-query` - Server state management
- `wouter` - Lightweight routing
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation integration
- `tailwindcss`, `autoprefixer`, `postcss` - Styling toolchain
- `clsx`, `tailwind-merge` - Conditional styling utilities
- `class-variance-authority` - Variant-based component styling
- `date-fns` - Date manipulation and formatting
- `cmdk` - Command palette component

**Backend**
- `express` - Web server framework
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication (implied by usage)
- `cookie-parser` - Cookie handling middleware
- `express-validator` - Request validation
- `drizzle-orm` - Type-safe ORM
- `drizzle-kit` - Database migrations and schema management
- `ws` - WebSocket client for Neon database connections
- `connect-pg-simple` - PostgreSQL session store

**Build Tools**
- `vite` - Frontend build tool and dev server
- `@vitejs/plugin-react` - React support for Vite
- `typescript` - Type checking
- `tsx` - TypeScript execution
- `esbuild` - JavaScript bundler for server code