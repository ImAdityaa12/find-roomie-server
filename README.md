# Roommate Finder

Version 1 (Mode 1) → "I need a Roommate"
└── Has a room/flat, looking for someone to share with
└── Can list their room with photos, rent, location

Version 2 (Mode 2) → "I need a Room"
└── Homeless/searching, looking for a room + roommate
└── No listing, just a profile + preferences

A Node.js backend application for finding compatible roommates and room listings with authentication, matching algorithms, and real-time messaging capabilities.

## Project Structure

```
roomate-finder/
├── src/
│   ├── db/
│   │   ├── index.ts          # Database connection setup
│   │   └── schema.ts         # Drizzle ORM schema definitions
│   ├── lib/
│   │   └── auth.ts           # Better Auth configuration
│   └── index.ts              # Express server entry point
├── drizzle.config.ts         # Drizzle Kit configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies
├── .env                      # Environment variables
└── .gitignore
```

## Tech Stack

### Core Dependencies

- **express** (^5.2.1) - Web framework for Node.js
- **typescript** (^5.9.3) - Type-safe JavaScript
- **ts-node** (^10.9.2) - TypeScript execution for Node.js

### Database & ORM

- **drizzle-orm** (^0.45.1) - TypeScript ORM for SQL databases
- **drizzle-kit** (^0.31.9) - CLI tool for Drizzle migrations
- **@neondatabase/serverless** (^1.0.2) - Neon PostgreSQL serverless driver

### Authentication

- **better-auth** (^1.5.1) - Modern authentication library with email/password support

### Utilities

- **dotenv** (^17.3.1) - Environment variable management
- **nodemon** (^3.1.14) - Development auto-reload

### Type Definitions

- **@types/express** (^5.0.6)
- **@types/node** (^25.3.3)

## Features

### User Management

- User authentication with Better Auth (email/password)
- User profiles with preferences and lifestyle information
- KYC verification system
- User status modes: looking for room or looking for roommate

### Room Listings

- Create and manage room listings
- Location-based search with coordinates
- Room types: private, shared, entire flat
- Furnishing options and amenities
- Photo uploads support

### Matching System

- Compatibility scoring algorithm
- Match requests with status tracking (pending, matched, rejected, expired)
- Saved profiles and listings
- Gender, age, and lifestyle preference filters

### Messaging

- Conversation threads between matched users
- Message read status tracking
- Real-time messaging support

### Safety Features

- User blocking system
- Report system for profiles, listings, and messages
- KYC document verification (Aadhaar, PAN, Driving License, Passport)

## Database Schema

The application uses PostgreSQL with the following main tables:

- `user` - User accounts (Better Auth compatible)
- `session`, `account`, `verification` - Better Auth tables
- `user_preferences` - User lifestyle and roommate preferences
- `room_listings` - Available room listings
- `compatibility_scores` - Calculated match scores between users
- `matches` - Match requests and status
- `conversations` & `messages` - Chat functionality
- `saved_profiles` & `saved_listings` - User bookmarks
- `kyc_verifications` - Identity verification documents
- `blocked_users` - User blocking relationships
- `reports` - User-generated reports

## Scripts

```bash
# Development
npm run dev              # Start development server with auto-reload

# Build
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production build

# Database
npm run db:generate      # Generate migration files
npm run db:migrate       # Run migrations
npm run
```
