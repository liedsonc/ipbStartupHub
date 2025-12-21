# Next.js App Router Frontend Structure

## Folder Structure

```
project-root/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout with navigation
│   │   ├── page.tsx                  # Homepage
│   │   ├── browse/
│   │   │   └── page.tsx              # Browse ideas page
│   │   ├── idea/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Idea detail page
│   │   ├── submit/
│   │   │   └── page.tsx              # Submit idea page
│   │   ├── category/
│   │   │   └── [name]/
│   │   │       └── page.tsx          # Category filtered view
│   │   ├── about/
│   │   │   └── page.tsx              # About page
│   │   └── not-found.tsx             # 404 page
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   │
│   │   ├── idea/                     # Idea-specific components
│   │   │   ├── IdeaCard.tsx          # Card for browse/list views
│   │   │   ├── IdeaDetail.tsx        # Full idea display
│   │   │   ├── IdeaForm.tsx          # Submit/edit form
│   │   │   ├── InterestButton.tsx    # "I'm Interested" button
│   │   │   ├── InterestList.tsx     # List of interested people
│   │   │   ├── IdeaFilters.tsx       # Filter sidebar/controls
│   │   │   └── RelatedIdeas.tsx      # Related ideas section
│   │   │
│   │   └── shared/                   # Shared feature components
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── PrototypeBanner.tsx
│   │
│   ├── lib/                          # Utilities and helpers
│   │   ├── api/                      # Data access layer (mock → API)
│   │   │   ├── ideas.ts              # Idea-related functions
│   │   │   ├── people.ts             # People-related functions
│   │   │   ├── interests.ts          # Interest-related functions
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                    # Pure utility functions
│   │   │   ├── format.ts             # Date, number formatting
│   │   │   ├── validation.ts         # Form validation
│   │   │   └── constants.ts          # App constants
│   │   │
│   │   └── hooks/                    # Custom React hooks
│   │       ├── useIdeas.ts           # Ideas data hook
│   │       ├── useIdea.ts            # Single idea hook
│   │       ├── useFilters.ts         # Filter state management
│   │       └── useInterest.ts        # Interest actions hook
│   │
│   ├── data/                         # Mock data (existing)
│   │   ├── mockIdeas.ts
│   │   ├── mockPeople.ts
│   │   ├── mockInterests.ts
│   │   └── index.ts
│   │
│   ├── types/                        # TypeScript types (existing)
│   │   └── index.ts
│   │
│   └── styles/                       # Global styles
│       └── globals.css                # Tailwind imports + custom styles
│
├── public/                           # Static assets
│   ├── images/
│   └── favicon.ico
│
├── next.config.js                     # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json
```

## Component Organization

### 1. UI Components (`components/ui/`)

**Purpose:** Reusable, style-only components with no business logic.

**Examples:**
- `Button` - Styled button with variants (primary, secondary, outline)
- `Card` - Container with shadow, padding, rounded corners
- `Badge` - Small label for categories, stages, tags
- `Input` - Text input with consistent styling
- `Select` - Dropdown select component
- `SearchBar` - Search input with icon

**Characteristics:**
- Accept props for customization
- No data fetching
- No business logic
- Fully controlled components
- Tailwind CSS only

**Usage:**
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  // Pure UI component
}
```

### 2. Layout Components (`components/layout/`)

**Purpose:** Page structure and navigation.

**Components:**
- `Header` - Site header with logo and navigation
- `Footer` - Site footer with links and disclaimer
- `Navigation` - Main navigation menu
- `Breadcrumbs` - Contextual navigation trail

**Characteristics:**
- Used in root layout or multiple pages
- May contain navigation logic (routing)
- No data fetching (static navigation)

### 3. Feature Components (`components/idea/`)

**Purpose:** Business logic components for specific features.

**Components:**
- `IdeaCard` - Displays idea summary in grid/list
- `IdeaDetail` - Full idea view with all information
- `IdeaForm` - Form for submitting new ideas
- `InterestButton` - Button to express interest (with state)
- `InterestList` - Displays list of interested people
- `IdeaFilters` - Filter controls for browse page
- `RelatedIdeas` - Shows related ideas

**Characteristics:**
- May fetch data via hooks
- Contains business logic
- May manage local state
- Uses UI components for presentation

**Usage:**
```typescript
// components/idea/IdeaCard.tsx
import { Idea } from '@/types';
import { Card, Badge } from '@/components/ui';

interface IdeaCardProps {
  idea: Idea;
  onClick?: () => void;
}

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
  // Uses UI components, displays idea data
}
```

### 4. Shared Components (`components/shared/`)

**Purpose:** Reusable components used across multiple features.

**Components:**
- `EmptyState` - Shows when no results found
- `LoadingSpinner` - Loading indicator
- `PrototypeBanner` - Disclaimer banner for prototype

**Characteristics:**
- Generic and reusable
- No feature-specific logic
- Used in multiple contexts

## Data Access Layer (`lib/api/`)

**Purpose:** Abstract data fetching. Easy to swap mock data for real APIs.

### Current Implementation (Mock)

```typescript
// lib/api/ideas.ts
import { getAllIdeas, getIdeaById, filterIdeas } from '@/data';
import { Idea, IdeaFilters } from '@/types';

export async function fetchIdeas(filters?: IdeaFilters): Promise<Idea[]> {
  // Currently uses mock data
  if (filters) {
    return filterIdeas(filters);
  }
  return getAllIdeas();
}

export async function fetchIdeaById(id: string): Promise<Idea | null> {
  const idea = getIdeaById(id);
  return idea || null;
}
```

### Future API Implementation

```typescript
// lib/api/ideas.ts (future)
export async function fetchIdeas(filters?: IdeaFilters): Promise<Idea[]> {
  // Replace with real API call
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.stage) params.set('stage', filters.stage);
  if (filters?.searchQuery) params.set('q', filters.searchQuery);
  
  const response = await fetch(`/api/ideas?${params}`);
  return response.json();
}
```

**Key Principle:** Pages and components call `lib/api` functions, not `data/` directly. Only `lib/api` needs to change when switching to real APIs.

## State Management Strategy

### 1. Server Components (Default)

**Use for:** Static content, initial data loading.

**Example:**
```typescript
// app/browse/page.tsx
import { fetchIdeas } from '@/lib/api/ideas';
import { IdeaGrid } from '@/components/idea/IdeaGrid';

export default async function BrowsePage() {
  const ideas = await fetchIdeas(); // Server-side data fetch
  
  return <IdeaGrid ideas={ideas} />;
}
```

**Benefits:**
- No client-side JavaScript for initial load
- SEO-friendly
- Fast initial render

### 2. Client Components with Local State

**Use for:** Interactive UI, form inputs, filters.

**Example:**
```typescript
// components/idea/IdeaFilters.tsx
'use client';

import { useState } from 'react';
import { IdeaFilters as Filters } from '@/types';

export function IdeaFilters({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<Filters>({});
  
  // Local state for filter UI
  // Calls onFilterChange when filters update
}
```

**When to use:**
- Form inputs
- Toggle buttons
- Search input
- Modal open/close state
- UI-only state (expanded/collapsed)

### 3. URL State (Search Params)

**Use for:** Shareable filters, browser back/forward.

**Example:**
```typescript
// app/browse/page.tsx
import { useSearchParams } from 'next/navigation';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const stage = searchParams.get('stage');
  
  // Use URL params to filter data
}
```

**When to use:**
- Filter state (category, stage, search query)
- Pagination
- Sort order
- Any state that should be shareable via URL

### 4. React Context (Minimal Use)

**Use for:** Truly global state that many components need.

**Example:**
```typescript
// lib/context/InterestContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

interface InterestContextType {
  addInterest: (ideaId: string) => void;
  hasInterest: (ideaId: string) => boolean;
}

const InterestContext = createContext<InterestContextType | null>(null);

export function InterestProvider({ children }: { children: React.ReactNode }) {
  const [interests, setInterests] = useState<Set<string>>(new Set());
  
  // Context logic
}
```

**When to use:**
- User's current interests (if we had auth)
- Theme preferences
- Global UI state (sidebar open/closed)
- **Avoid for:** Data that can be fetched, filter state (use URL)

### 5. Server Actions (Future)

**Use for:** Form submissions, mutations (when backend exists).

**Example:**
```typescript
// app/submit/actions.ts
'use server';

export async function submitIdea(formData: FormData) {
  // Server-side form handling
  // Will replace client-side mock functions
}
```

## Page Structure

### Homepage (`app/page.tsx`)

```typescript
import { fetchIdeas } from '@/lib/api/ideas';
import { Hero } from '@/components/home/Hero';
import { FeaturedIdeas } from '@/components/home/FeaturedIdeas';

export default async function HomePage() {
  const featuredIdeas = await fetchIdeas({ sortBy: 'mostInterest' });
  const recentIdeas = featuredIdeas.slice(0, 4);
  
  return (
    <>
      <Hero />
      <FeaturedIdeas ideas={recentIdeas} />
    </>
  );
}
```

### Browse Page (`app/browse/page.tsx`)

```typescript
import { fetchIdeas } from '@/lib/api/ideas';
import { IdeaGrid } from '@/components/idea/IdeaGrid';
import { IdeaFilters } from '@/components/idea/IdeaFilters';

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { category?: string; stage?: string; q?: string };
}) {
  const ideas = await fetchIdeas({
    category: searchParams.category as IdeaCategory,
    stage: searchParams.stage as IdeaStage,
    searchQuery: searchParams.q,
  });
  
  return (
    <>
      <IdeaFilters />
      <IdeaGrid ideas={ideas} />
    </>
  );
}
```

### Idea Detail (`app/idea/[id]/page.tsx`)

```typescript
import { fetchIdeaById } from '@/lib/api/ideas';
import { IdeaDetail } from '@/components/idea/IdeaDetail';
import { notFound } from 'next/navigation';

export default async function IdeaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const idea = await fetchIdeaById(params.id);
  
  if (!idea) {
    notFound();
  }
  
  return <IdeaDetail idea={idea} />;
}
```

## Data Flow

### Current (Mock Data)

```
Page Component
  ↓
lib/api/ideas.ts (fetchIdeas)
  ↓
data/index.ts (getAllIdeas)
  ↓
data/mockIdeas.ts (mockIdeas array)
```

### Future (Real API)

```
Page Component
  ↓
lib/api/ideas.ts (fetchIdeas)
  ↓
fetch('/api/ideas')
  ↓
Backend API
  ↓
Database
```

**Key:** Only `lib/api/` layer changes. All components and pages remain unchanged.

## Best Practices

### 1. Component Composition

```typescript
// Good: Compose UI components
<IdeaCard>
  <Card>
    <CardHeader>
      <h3>{idea.title}</h3>
      <Badge>{idea.category}</Badge>
    </CardHeader>
    <CardBody>
      <p>{idea.shortDescription}</p>
    </CardBody>
  </Card>
</IdeaCard>
```

### 2. Type Safety

```typescript
// Always type props
interface IdeaCardProps {
  idea: Idea; // Use types from @/types
  onClick?: (id: string) => void;
}
```

### 3. Separation of Concerns

```typescript
// Bad: Component fetches data directly
function IdeaCard({ id }: { id: string }) {
  const idea = getIdeaById(id); // Direct data access
}

// Good: Component receives data as prop
function IdeaCard({ idea }: { idea: Idea }) {
  // Pure presentation
}
```

### 4. Server vs Client Components

- **Default to Server Components** (faster, SEO-friendly)
- **Use 'use client' only when needed:**
  - Interactive elements (buttons, forms)
  - useState, useEffect hooks
  - Browser APIs
  - Event handlers

### 5. File Naming

- **Components:** PascalCase (`IdeaCard.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Types:** PascalCase interfaces (`Idea`, `IdeaFilters`)
- **Constants:** UPPER_SNAKE_CASE or camelCase (`MAX_RESULTS`)

## Migration Path to Real API

### Step 1: Create API Route Handlers

```typescript
// app/api/ideas/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Fetch from database
  return Response.json(ideas);
}
```

### Step 2: Update lib/api Functions

```typescript
// lib/api/ideas.ts
export async function fetchIdeas(filters?: IdeaFilters) {
  // Change from mock data to fetch('/api/ideas')
}
```

### Step 3: No Component Changes Needed

All components continue to work because they use `lib/api` functions, not direct data access.

## Summary

**Key Principles:**
1. **Separation:** UI components, data access, and page logic are separate
2. **Abstraction:** `lib/api` abstracts data source (mock → API)
3. **Server First:** Use Server Components by default
4. **State Minimalism:** URL state for filters, local state for UI, context only when necessary
5. **Type Safety:** TypeScript throughout
6. **No Premature Optimization:** Simple, clear structure that can evolve

**File Count Estimate:**
- ~15-20 UI components
- ~10-15 feature components
- ~5-8 page components
- ~5-8 utility/hook files
- ~4-6 API abstraction files

Total: ~40-60 files (manageable, clear structure)

