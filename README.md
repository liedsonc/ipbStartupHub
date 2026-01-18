# Startup Hub IPB

A university startup hub platform connecting students, mentors, and investors. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Idea Feed**: Browse startup ideas with filters by category and stage
- **Idea Detail**: View full idea descriptions with interest buttons
- **Create Idea**: Submit new startup ideas (stored in local state)
- **People Directory**: Browse students, professors, mentors, and investors

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── browse/            # Idea feed page
│   ├── idea/[id]/        # Idea detail page
│   ├── submit/           # Create idea page
│   └── people/           # People directory
├── components/            # React components
│   ├── ui/               # Reusable UI primitives
│   ├── layout/           # Layout components
│   ├── idea/             # Idea-specific components
│   └── shared/           # Shared components
├── lib/                  # Utilities and helpers
│   ├── api/              # Data access layer (mock → API)
│   └── utils/            # Utility functions
├── data/                 # Mock data
└── types/                # TypeScript types
```

## Key Features

### Full-Stack Platform
- PostgreSQL database with Prisma ORM
- NextAuth.js authentication with role-based access control
- RESTful API routes for data management
- Server and client components for optimal performance

### Production-Quality Components
- Fully typed with TypeScript
- Responsive design with Tailwind CSS
- Accessible and semantic HTML
- Clean component architecture

### State Management
- Server Components for initial data loading
- Client Components for interactive features
- URL state for filters (shareable, browser-friendly)
- Local state for forms and UI interactions

## Pages

1. **Homepage** (`/`) - Landing page with featured ideas
2. **Browse Ideas** (`/browse`) - Filterable list of all ideas
3. **Idea Detail** (`/idea/[id]`) - Full idea view with interest buttons
4. **Submit Idea** (`/submit`) - Form to create new ideas
5. **People Directory** (`/people`) - List of all people
6. **About** (`/about`) - Information about the platform

## Development

### Adding New Ideas
Ideas are stored in `src/data/mockIdeas.ts`. To add new ideas programmatically, use the form on `/submit`.

### Replacing Mock Data with APIs
Update the functions in `src/lib/api/` to call real API endpoints instead of mock data functions. All components will continue to work without changes.

### Styling
- Uses Tailwind CSS utility classes
- Custom styles in `src/styles/globals.css`
- Component-level styling with Tailwind

## Notes

- Full authentication system with user roles and permissions
- Data is persisted in PostgreSQL database
- Secure password hashing with bcrypt
- Role-based access control (RBAC) for different user types

## License

MIT

