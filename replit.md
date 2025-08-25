# Overview

A modern dating app built with React and Node.js that provides a Tinder-like experience for users to discover and connect with potential matches. The application features user authentication through Replit's OpenID Connect, profile creation and management, swipe-based matching, real-time messaging, and premium subscription functionality through Stripe integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: wouter for client-side routing with protected routes based on authentication state
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with WebSocket support for real-time messaging
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Error Handling**: Centralized error handling middleware with structured error responses

## Authentication System
- **Provider**: Replit OpenID Connect (OIDC) for seamless authentication
- **Session Storage**: Server-side sessions stored in PostgreSQL
- **Authorization**: Route-level protection with middleware checking authentication status
- **User Management**: Automatic user creation/update on successful authentication

## Database Design
- **Primary Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle migrations for version-controlled database changes
- **Key Tables**:
  - Users: Core user information and Stripe integration data
  - Profiles: Dating-specific user data (bio, preferences, photos)
  - Swipes: User interaction tracking for like/pass decisions
  - Matches: Mutual like relationships between users
  - Messages: Chat communication between matched users
  - Sessions: Authentication session storage

## Real-time Features
- **WebSocket Integration**: Real-time chat messaging between matched users
- **Connection Management**: Automatic reconnection and message synchronization
- **Live Updates**: Instant message delivery and read receipt tracking

## Payment Integration
- **Payment Processor**: Stripe for handling premium subscriptions
- **Subscription Management**: Multiple pricing tiers with feature gating
- **Customer Management**: Automatic customer creation and subscription tracking
- **Security**: Webhook verification for secure payment event handling

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL for serverless database hosting
- **Authentication**: Replit OIDC service for user authentication
- **Payment Processing**: Stripe for subscription management and payments
- **Media Storage**: External photo hosting for user profile images

## Development Tools
- **Build System**: Vite with TypeScript support and hot module replacement
- **Code Quality**: ESLint and TypeScript for static analysis
- **UI Development**: Storybook-ready component system with shadcn/ui

## Third-party Libraries
- **UI Components**: Radix UI primitives for accessible component foundation
- **Validation**: Zod for runtime type checking and form validation
- **Date Handling**: date-fns for date manipulation and formatting
- **WebSocket**: ws library for real-time communication
- **Utilities**: Various utility libraries for enhanced functionality (clsx, class-variance-authority)