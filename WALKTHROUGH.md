# Visual Walkthrough

This document describes what each section of your website looks like and how it functions.

## 🏠 Home Section

### Hero Banner
- **Full-screen hero** with a stunning background image
- **Large heading**: "Capturing Moments, Creating Memories"
- **Subheading**: Professional photography tagline
- **Two CTA buttons**:
  - "View Portfolio" (white button)
  - "Book a Session" (outlined button)
- **Dark overlay** on background for text readability

### Statistics Section (Gray Background)
Three circular icon cards displaying:
1. **500+ Sessions Completed** (Camera icon)
2. **300+ Happy Clients** (Users icon)
3. **15+ Awards Won** (Award icon)

### Featured Work Preview
- **Section heading**: "Featured Work"
- **3-column grid** of recent photos
- **Hover effect**: Image scales up, dark overlay appears
- **"View Full Portfolio" button** below grid

---

## 👤 About Section

### Main Content (2-Column Layout)

**Left Column**: 
- Large professional photographer image
- Decorative dark square behind image (offset)

**Right Column**:
- **Heading**: "Turning Fleeting Moments Into Timeless Art"
- **3 paragraphs** of bio text
- Professional, personal tone
- Experience and philosophy

### Core Values (3 Cards)
1. **Passion** (Heart icon)
   - Enthusiasm for every project
2. **Vision** (Eye icon)
   - Creative eye for detail
3. **Excellence** (Zap icon)
   - Commitment to quality

### Credentials Section (Dark Card)
- Black background with white text
- **Two columns**:
  - Education credentials
  - Recognition and awards

---

## 💼 Services Section

### Service Cards (3-Column Grid)

Each card includes:
- **Service image** at top
- **Price badge** (top right corner)
- **Service title** (large, bold)
- **Duration** with clock icon
- **Description** paragraph
- **Feature list** with checkmarks:
  - 5 features per service
  - Green checkmark icons
- **"Book Now" button** (full width, black)

### 6 Services Offered:
1. Studio Session - $299
2. Family Session - $349
3. Creative Session - $449
4. Branding Session - $399
5. Wedding Photography - $2,499
6. Portrait Session - $249

### Additional Info Card
- White card below services
- **3 columns** explaining what's included:
  - Professional Equipment (📸)
  - Expert Editing (✨)
  - Online Gallery (☁️)

### Bottom CTA
- "Not sure which service is right for you?"
- "Contact for Custom Quote" button

---

## 📸 Portfolio Section

### Category Filter Bar
- **7 filter buttons** in a row:
  - All (default)
  - Portrait
  - Family
  - Wedding
  - Branding
  - Creative
  - Studio
- Active category has black background
- Inactive categories have gray background

### Photo Grid
- **3-column grid** on desktop
- **2 columns** on tablet
- **1 column** on mobile
- **12 portfolio images** total
- **Square aspect ratio** for consistency

### Hover Effect
- Image scales up (zoom)
- Dark gradient overlay appears
- Title and category text slides up
- Smooth transitions

### Lightbox Modal
- Click any image to view full size
- **Black background** (95% opacity)
- **Close button** (top right)
- Click outside to close
- Image centered and scaled to fit

---

## 🔐 Authentication Modal

### Modal Design
- **Centered popup** on dark backdrop
- White card with rounded corners
- **Close button** (top right)

### Header
- "Welcome Back" (login) or "Create Account" (signup)
- Descriptive subtitle

### Google Sign-In Button
- White button with Chrome icon
- "Continue with Google" text
- Full width

### Divider
- "Or continue with email" text
- Horizontal lines on sides

### Email/Password Form
- **Email field** with mail icon
- **Password field** with lock icon
- Both fields have:
  - Labels above
  - Icons inside (left)
  - Rounded borders
  - Focus states

### Submit Button
- Black button, full width
- "Sign In" or "Create Account" text
- Loading state when processing

### Toggle Link
- "Don't have an account? Sign Up"
- Or "Already have an account? Sign In"
- Underlined, clickable

### Error Display
- Red background alert box
- Shows authentication errors
- Appears above form

---

## 📊 Client Dashboard

### Stats Overview (3 Cards)
1. **Total Sessions** (Calendar icon)
2. **Total Spent** (Dollar icon)
3. **Total Photos** (Image icon)

Each card shows:
- Label text (gray)
- Large number (black)
- Icon in circle (gray background)

### Sessions List
- White card with border
- **Header**: "My Sessions"
- Each session shows:
  - Service name (bold)
  - Status badge (colored pill)
  - Date with calendar icon
  - Price with dollar icon
  - Photo count with image icon
  - "View Photos" button (black)

### Status Badges
- **Completed**: Green background
- **Upcoming**: Blue background
- **Processing**: Yellow background

### Photo Gallery Modal
- **Full-screen overlay** (black background)
- **Header bar** with:
  - Session name and date
  - Photo count
  - Close button
- **"Download All Photos" button**
- **Photo grid** (3 columns)
- Click photo to view full size

### Empty State
- Shows when no sessions exist
- Gray image icon
- "No sessions yet" message
- Encouragement to book

---

## 🧭 Navigation Bar

### Desktop Navigation
- **Fixed to top** of page
- White background with subtle shadow
- **Logo** (left): Camera icon + "Lens & Light"
- **Nav items** (center):
  - Home
  - About
  - Services
  - Portfolio
  - Dashboard (if logged in)
- **Auth section** (right):
  - User email (if logged in)
  - Logout button (if logged in)
  - Sign In button (if not logged in)

### Active State
- Current section highlighted
- Black text for active
- Gray text for inactive

### Mobile Navigation
- **Hamburger menu** icon (right)
- **Dropdown menu** when opened:
  - All nav items listed vertically
  - User info at bottom
  - Sign in/out button

---

## 🦶 Footer

### 3-Column Layout

**Column 1**: Branding
- "Lens & Light" heading
- Brief description

**Column 2**: Quick Links
- About
- Services
- Portfolio
- All clickable, smooth scroll

**Column 3**: Contact
- Email address
- Phone number
- Location

### Bottom Bar
- Border separator
- Copyright notice
- Centered text

---

## 🎨 Design Elements

### Colors
- **Primary**: Black (#111827)
- **Background**: White / Light Gray
- **Text**: Dark Gray (#374151)
- **Accents**: Medium Gray (#6B7280)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 
  - H1: 4xl-7xl (very large)
  - H2: 3xl-5xl (large)
  - H3: 2xl-3xl (medium)
- **Body**: Base to lg
- **Small**: sm to xs

### Spacing
- **Sections**: Large vertical padding (py-20)
- **Cards**: Medium padding (p-6 to p-8)
- **Gaps**: Consistent grid gaps (gap-6 to gap-8)

### Borders
- **Radius**: Rounded-lg (0.5rem)
- **Shadows**: Subtle to prominent
- **Colors**: Light gray borders

### Transitions
- **Duration**: 300-500ms
- **Easing**: Default ease
- **Properties**: 
  - Transform (scale, translate)
  - Opacity
  - Background color

### Hover Effects
- **Images**: Scale up (110%)
- **Buttons**: Darken background
- **Cards**: Lift up (shadow increase)
- **Links**: Color change

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- **1 column** layouts
- **Stacked** elements
- **Hamburger** menu
- **Larger** touch targets
- **Full-width** buttons

### Tablet (768px - 1024px)
- **2 column** grids
- **Adjusted** spacing
- **Desktop** navigation
- **Medium** images

### Desktop (> 1024px)
- **3 column** grids
- **Full** navigation
- **Large** images
- **Optimal** spacing

---

## 🎭 Animations

### Page Load
- Smooth fade-in
- Content appears progressively

### Scroll
- Smooth scrolling between sections
- Active nav updates automatically

### Hover
- Image zoom
- Button color change
- Card lift
- Smooth transitions

### Modal
- Fade in backdrop
- Scale up content
- Smooth close

### Gallery
- Filter transition
- Image grid rearrange
- Lightbox fade

---

## 💡 User Flow Examples

### Booking a Service
1. Land on home page
2. Click "Book a Session" or navigate to Services
3. Browse service cards
4. Click "Book Now" on desired service
5. If not logged in, auth modal appears
6. Sign in or create account
7. Stripe checkout initiated (placeholder)

### Viewing Portfolio
1. Navigate to Portfolio section
2. Browse all photos
3. Click category filter
4. View filtered results
5. Click image for full size
6. Close lightbox or view next

### Checking Dashboard
1. Sign in to account
2. Navigate to Dashboard
3. View session statistics
4. Browse session list
5. Click "View Photos"
6. Browse photo gallery
7. Download individual or all photos

---

## ✨ Special Features

### Smooth Scrolling
- Click nav items
- Smooth scroll to section
- Active section highlights

### Image Lightbox
- Click any portfolio image
- View full size
- Dark background
- Easy close

### Authentication Flow
- Modal popup
- Multiple sign-in options
- Error handling
- Success redirect

### Protected Content
- Dashboard requires login
- Automatic redirect
- Persistent session

### Responsive Images
- Optimized sizes
- Fast loading
- High quality
- Proper aspect ratios

---

This walkthrough gives you a complete picture of your website's design and functionality. Every element has been carefully crafted for a professional, modern look that showcases photography beautifully! 📸✨
