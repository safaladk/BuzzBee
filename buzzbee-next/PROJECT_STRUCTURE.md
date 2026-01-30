# BuzzBee Project Structure

## Project Overview
BuzzBee is a modern event discovery and booking platform built with Next.js 14, React, and Tailwind CSS.

## Folder Structure

```
buzzbee/
├── app/
│   ├── (routes)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── events/
│   │   │   └── page.tsx               # Events browsing page
│   │   ├── login/
│   │   │   └── page.tsx               # User login page
│   │   ├── signup/
│   │   │   └── page.tsx               # User registration page
│   │   └── organizer/
│   │       ├── create-event/
│   │       │   └── page.tsx           # Create event form page
│   │       └── dashboard/
│   │           └── page.tsx           # Organizer dashboard
│   ├── layout.tsx                      # Root layout with Navbar & Footer
│   ├── globals.css                     # Global styles
│   └── page.tsx                        # Entry point (re-exports from routes)
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx                  # Navigation bar component
│   ├── ui/
│   │   ├── Button.tsx                  # Reusable button component
│   │   ├── EventCard.tsx               # Event card component
│   │   └── CategoryFilter.tsx          # Category filter component
│   └── sections/
│       ├── Hero.tsx                    # Hero section with search
│       ├── StatsSection.tsx            # Statistics display section
│       └── Footer.tsx                  # Footer component
│
├── lib/
│   ├── types.ts                        # TypeScript interfaces and types
│   └── constants.ts                    # Sample data and constants
│
├── public/
│   └── [static files]
│
├── next.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── README.md
```

## Component Organization

### `/components/layout`
- **Navbar.tsx**: Sticky navigation bar with user profile and links

### `/components/ui`
- **Button.tsx**: Reusable button with multiple variants (primary, secondary, outline, ghost)
- **EventCard.tsx**: Displays event information with image, details, and booking
- **CategoryFilter.tsx**: Horizontal scrollable category filter

### `/components/sections`
- **Hero.tsx**: Large hero banner with search functionality
- **StatsSection.tsx**: Statistics grid showing platform metrics
- **Footer.tsx**: Footer with links and copyright

## Pages

### Landing Page (`(routes)/page.tsx`)
- Home page with Hero section and Stats
- Entry point for new users

### Events Page (`(routes)/events/page.tsx`)
- Browse all events with category filtering
- Search and sort functionality
- Responsive grid layout

### Login Page (`(routes)/login/page.tsx`)
- Email/password login form
- Social login options
- Links to signup page

### Signup Page (`(routes)/signup/page.tsx`)
- User registration form
- Account type selection (user/organizer)
- Terms and conditions agreement

### Create Event Page (`(routes)/organizer/create-event/page.tsx`)
- Event creation form for organizers
- Event details input (title, description, date, location, etc.)
- Image upload support

### Organizer Dashboard (`(routes)/organizer/dashboard/page.tsx`)
- Overview of organizer's events
- Statistics (total events, attendees, revenue)
- Event management (edit, delete, view)

## Type Definitions (`lib/types.ts`)

- **Event**: Event data structure
- **User**: User profile information
- **Category**: Category metadata
- **Stat**: Statistics display data

## Constants (`lib/constants.ts`)

- **sampleEvents**: Array of sample event data
- **categories**: Available event categories
- **stats**: Platform statistics

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Gradients**: Purple-to-pink gradient theme
- **Responsive Design**: Mobile-first approach

## Key Features

✅ Reusable components with TypeScript
✅ Proper Next.js routing with (routes) convention
✅ Component-based page architecture
✅ Responsive design
✅ Type-safe code
✅ Separated concerns (UI, Sections, Layout)
✅ Constants and data management
✅ Landing + Browse + Auth + Organizer pages

## Navigation Routes

- `/` - Landing page
- `/events` - Events browsing
- `/login` - Login page
- `/signup` - Signup page
- `/organizer/create-event` - Create event
- `/organizer/dashboard` - Organizer dashboard

## Running the Project

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.
