# Quick Setup Guide

Follow these steps to get your photographer portfolio website up and running.

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

## Step 1.5: Create ESLint Configuration

ESLint 9 requires a new flat config format. Create a file named `eslint.config.js` in the project root:

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

## Step 2: Configure Firebase

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2.2 Enable Authentication

1. In Firebase Console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. Enable **Google**:
   - Click on "Google"
   - Toggle "Enable"
   - Enter your project support email
   - Click "Save"

### 2.3 Create Firestore Database

1. In Firebase Console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can update security rules later)
4. Select your preferred location
5. Click "Enable"

### 2.4 Get Firebase Configuration

1. In Firebase Console, click on the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon (</>) to add a web app
5. Register your app with a nickname (e.g., "Photographer Portfolio")
6. Copy the `firebaseConfig` object

### 2.5 Update Firebase Config in Your Project

Open `src/config/firebase.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 3: Configure Stripe (Optional for Testing)

### 3.1 Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up for a free account

### 3.2 Get Publishable Key

1. In Stripe Dashboard, click on "Developers" in the top right
2. Click on "API keys"
3. Copy the "Publishable key" (starts with `pk_test_`)

### 3.3 Update Stripe Config

Open `src/config/stripe.ts` and replace:

```typescript
export const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');
```

**Note**: The Stripe integration requires a backend API for production use. The current implementation shows a placeholder alert. See README.md for full integration details.

## Step 4: Start Development Server

```bash
npm run dev
```

Your site will be available at `http://localhost:5173`

## Step 5: Test the Application

### Test Authentication

1. Click "Sign In" button in the navigation
2. Try creating an account with email/password
3. Try signing in with Google (requires proper OAuth setup in Firebase)

### Test Navigation

1. Click through all navigation items: Home, About, Services, Portfolio
2. Verify smooth scrolling between sections

### Test Services

1. Go to Services section
2. Click "Book Now" on any service
3. You'll see a placeholder alert (Stripe backend needed for actual payment)

### Test Portfolio

1. Go to Portfolio section
2. Click on category filters
3. Click on images to view them in full size

### Test Dashboard (Requires Sign In)

1. Sign in to your account
2. Navigate to Dashboard
3. View mock session data
4. Click "View Photos" to see the photo gallery

## Step 6: Customize Your Site

### Replace Stock Photos

Edit `src/data/mockData.ts` and replace Unsplash URLs with your own photos:

```typescript
image: 'https://your-photo-url.com/photo.jpg'
```

### Update Site Name

1. Open `src/components/Navigation.tsx`
2. Change "Lens & Light" to your business name
3. Also update in `src/App.tsx` footer section

### Update About Section

Open `src/components/sections/About.tsx` and customize:
- Bio text
- Credentials
- Values and philosophy

### Modify Services

Edit `src/data/mockData.ts` to add/remove/modify services:
- Change prices
- Update descriptions
- Modify features lists

### Update Contact Information

Open `src/App.tsx` and update the footer contact details:
- Email address
- Phone number
- Location

## Step 7: Build for Production

When ready to deploy:

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

## Common Issues & Solutions

### Issue: Firebase authentication not working

**Solution**: 
- Verify you've enabled Email/Password and Google providers in Firebase Console
- Check that your Firebase config is correct
- For Google sign-in, ensure you've set up OAuth consent screen

### Issue: Images not loading

**Solution**: 
- Stock images use Unsplash URLs which require internet connection
- Replace with your own hosted images for production

### Issue: Stripe checkout not working

**Solution**: 
- This is expected! The current implementation is a placeholder
- You need to set up a backend API (see README.md for details)
- For testing, the alert message confirms the booking flow works

### Issue: Dashboard shows no data

**Solution**: 
- The dashboard uses mock data for demonstration
- In production, you'll need to:
  - Create Firestore collections
  - Store session data after successful Stripe payments
  - Query user-specific data from Firestore

## Next Steps

1. **Add Your Photos**: Replace all stock images with your actual photography
2. **Set Up Backend**: Implement Stripe checkout backend (see README.md)
3. **Configure Firestore**: Set up proper database structure and security rules
4. **Deploy**: Choose a hosting provider (Firebase Hosting, Vercel, Netlify)
5. **Custom Domain**: Connect your own domain name
6. **SEO**: Add meta tags, sitemap, and optimize for search engines

## Need Help?

- Check the main README.md for detailed documentation
- Review Firebase documentation: https://firebase.google.com/docs
- Review Stripe documentation: https://stripe.com/docs

Happy building! 🎉
