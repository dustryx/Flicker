# 🚀 VS Code Setup Guide - LoveConnect Dating App

## 📋 Prerequisites

Make sure you have these installed on your computer:
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **VS Code** - Download from [code.visualstudio.com](https://code.visualstudio.com/)
- **Git** - Download from [git-scm.com](https://git-scm.com/)

## 📁 Project Structure to Copy

Create this folder structure in VS Code:

```
LoveConnect/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
├── postcss.config.js
├── components.json
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
├── server/
│   ├── db.ts
│   ├── index.ts
│   ├── replitAuth.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
└── .env
```

## 🛠️ Setup Steps

### 1. Create Project Folder
```bash
mkdir LoveConnect
cd LoveConnect
```

### 2. Copy All Files
Copy all the files from this project to your VS Code project folder.

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Up Environment Variables
Create a `.env` file in the root directory:

```env
# Database (you'll need to set up PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/loveconnect"
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=loveconnect

# Authentication (for Replit auth, you'll need to modify for local auth)
SESSION_SECRET=your-super-secret-session-key-here
REPLIT_DOMAINS=localhost:5000

# Stripe (get these from Stripe dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# For production
NODE_ENV=development
```

### 5. Set Up Database
You have two options:

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database
createdb loveconnect

# Run migrations
npm run db:push
```

**Option B: Use Neon (Online Database)**
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create database
4. Copy connection string to DATABASE_URL

### 6. Start Development Server
```bash
npm run dev
```

Your app will run on `http://localhost:5000`

## 📂 File Copying Checklist

### Root Files:
- [ ] package.json
- [ ] vite.config.ts
- [ ] tailwind.config.ts
- [ ] tsconfig.json
- [ ] drizzle.config.ts
- [ ] postcss.config.js
- [ ] components.json
- [ ] .env (create new)

### Client Files (client/src/):
- [ ] App.tsx
- [ ] main.tsx
- [ ] index.css

### Components (client/src/components/):
- [ ] SwipeCard.tsx
- [ ] ChatMessage.tsx
- [ ] CheckoutForm.tsx
- [ ] PhotoUpload.tsx
- [ ] MPesaPayment.tsx
- [ ] LoadingSpinner.tsx
- [ ] ErrorBoundary.tsx
- [ ] ui/ folder (all UI components)

### Pages (client/src/pages/):
- [ ] landing.tsx
- [ ] home.tsx
- [ ] profile-setup.tsx
- [ ] terms-privacy.tsx
- [ ] matches.tsx
- [ ] chat.tsx
- [ ] premium.tsx
- [ ] settings.tsx
- [ ] not-found.tsx

### Hooks (client/src/hooks/):
- [ ] useAuth.ts
- [ ] use-toast.ts
- [ ] use-mobile.tsx

### Lib (client/src/lib/):
- [ ] utils.ts
- [ ] queryClient.ts
- [ ] authUtils.ts

### Server Files (server/):
- [ ] index.ts
- [ ] db.ts
- [ ] routes.ts
- [ ] storage.ts
- [ ] replitAuth.ts
- [ ] vite.ts

### Shared Files (shared/):
- [ ] schema.ts

## 🔧 VS Code Extensions (Recommended)

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **TypeScript Importer**
4. **Auto Rename Tag**
5. **Prettier - Code formatter**
6. **ESLint**
7. **Thunder Client** (for API testing)

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Database operations
npm run db:push     # Apply schema changes
npm run db:studio   # Open database GUI
npm run db:generate # Generate migrations

# Type checking
npm run type-check
```

## 🔍 Troubleshooting

### Common Issues:

**1. "Module not found" errors:**
```bash
npm install
```

**2. Database connection errors:**
- Check your DATABASE_URL in .env
- Make sure PostgreSQL is running
- Verify database exists

**3. TypeScript errors:**
```bash
npm run type-check
```

**4. Port already in use:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**5. Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

When ready to deploy:

1. **Vercel (Frontend):**
```bash
npm install -g vercel
vercel
```

2. **Railway (Backend):**
- Push to GitHub
- Connect Railway to your repo
- Deploy automatically

3. **Database:**
- Use Neon, PlanetScale, or Railway PostgreSQL

## 🎯 Next Steps

After setup:
1. Customize colors in `tailwind.config.ts`
2. Add your branding in `client/src/pages/landing.tsx`
3. Set up real payment keys for production
4. Configure authentication for your domain
5. Add your own sample data

Your LoveConnect dating app is now ready to run in VS Code! 🎉