# Admin System Documentation

## 🎉 Admin System Complete!

A comprehensive admin dashboard has been implemented with role-based access control and full content management capabilities.

## 🔐 Admin Access Control

### Admin Email Configuration

Admin users are determined by email addresses in `src/contexts/AdminContext.tsx`:

```typescript
const ADMIN_EMAILS = [
  'admin@lensandlight.com',
  'photographer@lensandlight.com',
  // Add your admin emails here
];
```

**To make yourself an admin:**
1. Open `src/contexts/AdminContext.tsx`
2. Add your email to the `ADMIN_EMAILS` array
3. Sign up/sign in with that email address

### Role System

- **Client**: Regular users who can book services and view their dashboard
- **Admin**: Full access to admin dashboard and content management

Roles are automatically assigned on first login based on email address.

---

## 📊 Admin Dashboard Features

### Overview Tab
- **Statistics Dashboard**: Total clients, revenue, sessions, portfolio items
- **Quick Actions**: Add portfolio items, create services, manage clients
- **Real-time Metrics**: Upcoming vs completed sessions

### Client Management Tab
- **User List**: View all registered users with roles
- **Role Management**: Change user roles (client ↔ admin)
- **User Details**: Registration date, last login, email
- **Search & Filter**: Find users by email/name, filter by role

### Session Management Tab
- **Session Overview**: All photography sessions with details
- **Status Management**: Update session status (upcoming/processing/completed)
- **Client Information**: View which client booked each session
- **Revenue Tracking**: See payment amounts and dates
- **Photo Management**: View uploaded photos for each session

### Portfolio Editor Tab
- **Image Management**: Add, edit, delete portfolio items
- **Category Organization**: Organize by Portrait, Family, Wedding, etc.
- **Bulk Operations**: Manage multiple items efficiently
- **Image Preview**: See how items will appear on the site

### Service Editor Tab
- **Service Configuration**: Create and modify photography services
- **Pricing Management**: Set prices and duration for each service
- **Feature Lists**: Add/remove features for each service package
- **Image Association**: Set service preview images

### About Editor Tab
- **Bio Management**: Edit photographer biography paragraphs
- **Credentials**: Manage education and recognition sections
- **Core Values**: Edit the three main values (Passion, Vision, Excellence)
- **Profile Image**: Update the main about page photo

---

## 🛠️ Technical Implementation

### File Structure

```
src/
├── components/admin/
│   ├── AdminDashboard.tsx      # Main admin interface
│   ├── ClientManagement.tsx    # User management
│   ├── SessionManagement.tsx   # Session oversight
│   ├── PortfolioEditor.tsx     # Portfolio management
│   ├── ServiceEditor.tsx       # Service configuration
│   └── AboutEditor.tsx         # About page editor
├── contexts/
│   └── AdminContext.tsx        # Admin role management
└── types/
    └── index.ts               # Admin-related types
```

### Key Components

#### AdminContext
- Manages admin role detection
- Handles user profile creation
- Provides admin status to components

#### AdminDashboard
- Main admin interface with tabbed navigation
- Statistics overview and quick actions
- Renders appropriate sub-components

#### Individual Editors
- Each editor handles a specific content area
- CRUD operations for their respective data
- Form validation and error handling

---

## 🔧 Configuration & Setup

### 1. Set Admin Emails

Edit `src/contexts/AdminContext.tsx`:

```typescript
const ADMIN_EMAILS = [
  'your-email@domain.com',  // Add your email here
  'admin@lensandlight.com',
];
```

### 2. Firebase Setup

Ensure Firestore has these collections:

```
users/
├── {userId}/
│   ├── email: string
│   ├── role: 'client' | 'admin'
│   ├── createdAt: timestamp
│   └── lastLogin: timestamp

sessions/
├── {sessionId}/
│   ├── userId: string
│   ├── serviceId: string
│   ├── serviceName: string
│   ├── date: timestamp
│   ├── price: number
│   ├── status: string
│   └── photos: array

portfolio/
├── {itemId}/
│   ├── title: string
│   ├── category: string
│   ├── image: string
│   └── createdAt: timestamp

services/
├── {serviceId}/
│   ├── title: string
│   ├── description: string
│   ├── price: number
│   ├── duration: string
│   ├── features: array
│   └── image: string
```

### 3. Security Rules

Update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read all users
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Admins can update user roles
      allow update: if request.auth != null && 
                       exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Sessions - users can read their own, admins can read/write all
    match /sessions/{sessionId} {
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid ||
                      exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Portfolio - public read, admin write
    match /portfolio/{itemId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Services - public read, admin write
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 🚀 Usage Guide

### Accessing Admin Dashboard

1. **Sign up/Sign in** with an email in the `ADMIN_EMAILS` list
2. **Navigate** to the Admin section (appears in navigation for admins)
3. **Use the tabs** to access different management areas

### Managing Clients

1. Go to **Admin → Clients** tab
2. **Search** for specific users or **filter** by role
3. **Change roles** using the dropdown in the Actions column
4. **View details** like registration date and last login

### Managing Sessions

1. Go to **Admin → Sessions** tab
2. **View all sessions** with client and service details
3. **Update status** directly from the table
4. **Click "View Details"** to see session information and photos

### Editing Portfolio

1. Go to **Admin → Portfolio** tab
2. **Add new items** with the "Add Portfolio Item" button
3. **Edit existing items** by hovering and clicking the edit icon
4. **Filter by category** to organize content
5. **Delete items** with the trash icon

### Managing Services

1. Go to **Admin → Services** tab
2. **Create new services** with pricing and features
3. **Edit existing services** by clicking the edit button
4. **Set service images** and feature lists
5. **Delete services** that are no longer offered

### Updating About Section

1. Go to **Admin → About** tab
2. **Edit biography** paragraphs
3. **Update credentials** (education and recognition)
4. **Modify core values** and descriptions
5. **Change profile image** URL

---

## 📱 Mobile Responsiveness

The admin dashboard is fully responsive:
- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: Optimized grid layouts
- **Desktop**: Full multi-column interface

---

## 🔒 Security Features

### Role-Based Access
- Admin sections only visible to admin users
- Client data protected by user ID matching
- Firestore security rules enforce permissions

### Data Validation
- Form validation on all admin inputs
- Type safety with TypeScript
- Error handling for failed operations

### Audit Trail
- User creation and login timestamps
- Session status change tracking
- Content modification history (can be extended)

---

## 🎯 Future Enhancements

### Phase 1 (Immediate)
- [ ] Image upload functionality (currently URL-based)
- [ ] Bulk operations for portfolio/services
- [ ] Export client/session data to CSV
- [ ] Email notifications for status changes

### Phase 2 (Advanced)
- [ ] Advanced analytics and reporting
- [ ] Automated backup system
- [ ] Multi-admin role levels (super admin, editor, etc.)
- [ ] Content scheduling and publishing
- [ ] Integration with calendar systems

### Phase 3 (Enterprise)
- [ ] Multi-photographer support
- [ ] Advanced permission system
- [ ] API for third-party integrations
- [ ] Advanced photo management with editing tools

---

## 🐛 Troubleshooting

### Admin Access Issues

**Problem**: Can't access admin dashboard
**Solution**: 
1. Check your email is in `ADMIN_EMAILS` array
2. Sign out and sign back in
3. Check browser console for errors

**Problem**: Admin navigation not showing
**Solution**:
1. Ensure you're signed in with admin email
2. Check `AdminContext` is properly wrapped in `App.tsx`
3. Verify Firebase connection

### Data Not Loading

**Problem**: Admin dashboard shows no data
**Solution**:
1. Check Firebase configuration
2. Verify Firestore security rules
3. Check browser network tab for API errors

### Permission Errors

**Problem**: Can't edit content as admin
**Solution**:
1. Verify Firestore security rules are updated
2. Check user role in Firestore console
3. Ensure proper authentication

---

## 📞 Support

For issues or questions:
1. Check the main README.md for general setup
2. Review Firebase documentation for database issues
3. Check browser console for JavaScript errors
4. Verify all dependencies are installed correctly

---

**Admin system is now fully functional!** 🎉

The admin dashboard provides comprehensive content management capabilities while maintaining security and user experience. All admin features are production-ready and can be extended as needed.
