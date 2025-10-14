# Quick Reference Guide

## 🚀 Getting Started (First Time)

```bash
cd C:\Users\tonyp\CascadeProjects\photographer-portfolio
npm install
```

### Create ESLint Config (Required)

Create `eslint.config.js` in project root:

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

Then start dev server:

```bash
npm run dev
```

Open: http://localhost:5173

## ⚙️ Configuration Files

### Firebase Config
**File**: `src/config/firebase.ts`
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

### Stripe Config
**File**: `src/config/stripe.ts`
```typescript
export const stripePromise = loadStripe('pk_test_YOUR_KEY');
```

## 📝 Common Customizations

### Change Business Name
**Files to update**:
1. `src/components/Navigation.tsx` - Line with "Lens & Light"
2. `src/App.tsx` - Footer section
3. `index.html` - Title tag

### Update Services
**File**: `src/data/mockData.ts`
```typescript
{
  id: 'your-service-id',
  title: 'Your Service Name',
  description: 'Description here',
  price: 299,
  duration: '2 hours',
  features: ['Feature 1', 'Feature 2'],
  image: 'https://your-image-url.com/image.jpg'
}
```

### Update Portfolio Items
**File**: `src/data/mockData.ts`
```typescript
{
  id: '1',
  title: 'Photo Title',
  category: 'Portrait', // or Family, Wedding, etc.
  image: 'https://your-image-url.com/image.jpg'
}
```

### Update About Section
**File**: `src/components/sections/About.tsx`
- Bio paragraphs (lines ~30-50)
- Credentials section (lines ~90-110)

### Update Contact Info
**File**: `src/App.tsx`
- Footer section (lines ~80-100)

## 🎨 Styling Changes

### Colors
**File**: `tailwind.config.js`
```javascript
theme: {
  extend: {
    colors: {
      primary: '#111827',  // Change this
      // Add more custom colors
    }
  }
}
```

### Fonts
**File**: `index.html`
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600;700&display=swap" rel="stylesheet">
```

**File**: `tailwind.config.js`
```javascript
fontFamily: {
  sans: ['YourFont', 'system-ui', 'sans-serif'],
}
```

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit

# Format code (if you add prettier)
npx prettier --write src/
```

## 📂 File Locations Quick Map

```
Authentication Logic → src/contexts/AuthContext.tsx
Navigation Bar → src/components/Navigation.tsx
Auth Modal → src/components/AuthModal.tsx

Home Section → src/components/sections/Home.tsx
About Section → src/components/sections/About.tsx
Services Section → src/components/sections/Services.tsx
Portfolio Section → src/components/sections/Portfolio.tsx
Dashboard Section → src/components/sections/Dashboard.tsx

Services Data → src/data/mockData.ts
Portfolio Data → src/data/mockData.ts

Firebase Setup → src/config/firebase.ts
Stripe Setup → src/config/stripe.ts

Types → src/types/index.ts
Styles → src/index.css
```

## 🐛 Troubleshooting

### Firebase Auth Not Working
1. Check Firebase Console → Authentication → Sign-in method
2. Verify Email/Password is enabled
3. Verify Google OAuth is enabled
4. Check `src/config/firebase.ts` has correct credentials

### Images Not Loading
- Stock images require internet connection
- Check image URLs are valid
- Replace with your own hosted images

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Common fix: restart dev server
# Ctrl+C then npm run dev
```

## 📦 Adding New Dependencies

```bash
# Add a package
npm install package-name

# Add a dev dependency
npm install -D package-name

# Example: Add date formatting
npm install date-fns
```

## 🔒 Environment Variables (Optional)

Create `.env` file:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... etc
```

Use in code:
```typescript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
```

## 🌐 Deployment Quick Commands

### Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## 📊 Performance Tips

### Optimize Images
```bash
# Install image optimization tool
npm install -D vite-plugin-image-optimizer

# Add to vite.config.ts
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
plugins: [react(), ViteImageOptimizer()]
```

### Analyze Bundle Size
```bash
npm run build
# Check dist/ folder size

# Or use bundle analyzer
npm install -D rollup-plugin-visualizer
```

## 🔍 Testing Checklist

### Before Going Live
- [ ] Firebase credentials configured
- [ ] All stock photos replaced
- [ ] Business name updated
- [ ] Contact info updated
- [ ] Services customized
- [ ] About section personalized
- [ ] Test sign up/sign in
- [ ] Test Google OAuth
- [ ] Test all navigation links
- [ ] Test on mobile device
- [ ] Test in different browsers
- [ ] Check console for errors
- [ ] Test booking flow
- [ ] Verify responsive design

## 💡 Quick Tips

### Hot Reload Not Working?
- Save the file again
- Restart dev server
- Check for syntax errors

### Want to Add a New Section?
1. Create component in `src/components/sections/`
2. Import in `src/App.tsx`
3. Add to main JSX
4. Add nav item in `Navigation.tsx`

### Want to Change Layout?
- All sections use TailwindCSS
- Modify className props
- Use Tailwind documentation for reference

### Want to Add Icons?
```typescript
import { IconName } from 'lucide-react';
<IconName className="w-6 h-6" />
```

Browse icons: https://lucide.dev/icons

## 📱 Testing on Mobile

### Local Network Testing
1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Start dev server: `npm run dev`
3. On mobile, visit: `http://YOUR_IP:5173`

### Responsive Testing in Browser
- Chrome DevTools: F12 → Toggle device toolbar
- Test different screen sizes
- Check touch interactions

## 🎯 Common Tasks Time Estimates

| Task | Time |
|------|------|
| Initial setup | 30-60 min |
| Replace all photos | 1-2 hours |
| Customize content | 1-2 hours |
| Configure Firebase | 15-30 min |
| Configure Stripe | 15-30 min |
| Deploy to hosting | 15-30 min |
| **Total** | **3-6 hours** |

## 📞 Getting Help

### Documentation
- README.md - Full documentation
- SETUP_GUIDE.md - Step-by-step setup
- FEATURES.md - Feature list
- WALKTHROUGH.md - Visual guide

### External Resources
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- TailwindCSS: https://tailwindcss.com/docs
- Firebase: https://firebase.google.com/docs
- Stripe: https://stripe.com/docs
- Vite: https://vitejs.dev/guide

### Community
- Stack Overflow for coding questions
- Firebase Discord for Firebase help
- Stripe Discord for payment help

---

**Pro Tip**: Bookmark this file for quick reference! 🔖
