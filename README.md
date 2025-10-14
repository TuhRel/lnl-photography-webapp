# Photographer Portfolio Website

A modern, minimalistic single-page application for a freelance photographer built with React, TypeScript, TailwindCSS, Firebase Authentication, and Stripe integration.

## Features

- ✨ **Modern Minimalistic Design** - Clean, professional interface with smooth animations
- 🏠 **Home Section** - Hero banner with featured work preview
- 👤 **About Section** - Photographer bio and credentials
- 💼 **Services Section** - Service cards with Stripe payment integration
- 📸 **Portfolio Section** - Filterable gallery of photography work
- 🔐 **Authentication** - Email/password and Google OAuth sign-in
- 📊 **Client Dashboard** - View past sessions, photos, and payment history
- 📱 **Fully Responsive** - Works seamlessly on all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Payments**: Stripe
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Stripe account

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd C:\Users\tonyp\CascadeProjects\photographer-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication (Email/Password and Google providers)
   - Enable Firestore Database
   - Copy your Firebase config
   - Update `src/config/firebase.ts` with your Firebase credentials:
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

4. **Configure Stripe**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Get your publishable key from Developers > API keys
   - Update `src/config/stripe.ts` with your Stripe publishable key:
   ```typescript
   export const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## Project Structure

```
photographer-portfolio/
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── Navigation.tsx
│   │   └── AuthModal.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── config/
│   │   ├── firebase.ts
│   │   └── stripe.ts
│   ├── data/
│   │   └── mockData.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Firebase Setup

### Authentication Setup

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable **Email/Password** provider
3. Enable **Google** provider and configure OAuth consent screen

### Firestore Database Setup

Create the following collections:

1. **users** - Store user profiles
   ```
   users/{userId}
   - email: string
   - createdAt: timestamp
   - displayName: string
   ```

2. **sessions** - Store client sessions
   ```
   sessions/{sessionId}
   - userId: string
   - serviceId: string
   - serviceName: string
   - date: timestamp
   - price: number
   - photos: array
   - status: string
   ```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /sessions/{sessionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
  }
}
```

## Stripe Integration

### Backend Setup (Required for Production)

The current implementation includes a placeholder for Stripe checkout. To fully integrate Stripe:

1. **Create a backend API** (Node.js/Express, Firebase Functions, etc.)
2. **Implement checkout session endpoint**:
   ```javascript
   // Example using Express and Stripe
   app.post('/api/create-checkout-session', async (req, res) => {
     const { serviceId, price, serviceName } = req.body;
     
     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: [{
         price_data: {
           currency: 'usd',
           product_data: {
             name: serviceName,
           },
           unit_amount: price * 100,
         },
         quantity: 1,
       }],
       mode: 'payment',
       success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
       cancel_url: `${YOUR_DOMAIN}/services`,
     });
     
     res.json({ id: session.id });
   });
   ```

3. **Update `src/config/stripe.ts`** to call your backend API

## Customization

### Replace Stock Photos

Replace the Unsplash URLs in `src/data/mockData.ts` with your own photos:

```typescript
export const services: Service[] = [
  {
    id: 'studio-session',
    title: 'Studio Session',
    image: '/path/to/your/image.jpg', // Replace this
    // ...
  }
];
```

### Update Branding

1. **Site Name**: Update "Lens & Light" in `src/components/Navigation.tsx` and `src/App.tsx`
2. **Colors**: Modify TailwindCSS theme in `tailwind.config.js`
3. **Fonts**: Change font imports in `index.html` and update `tailwind.config.js`

### Add More Services

Add new service objects to the `services` array in `src/data/mockData.ts`:

```typescript
{
  id: 'new-service',
  title: 'New Service',
  description: 'Service description',
  price: 399,
  duration: '2 hours',
  features: ['Feature 1', 'Feature 2'],
  image: 'image-url'
}
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service (Vercel, Netlify, Firebase Hosting, etc.).

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Future Enhancements

- [ ] Backend API for Stripe integration
- [ ] Email notifications for bookings
- [ ] Admin dashboard for managing sessions
- [ ] Blog section
- [ ] Contact form
- [ ] Photo upload functionality
- [ ] Calendar integration for booking
- [ ] Reviews and testimonials section
- [ ] Social media integration

## Support

For issues or questions, please create an issue in the repository or contact the developer.

## License

This project is private and proprietary.
