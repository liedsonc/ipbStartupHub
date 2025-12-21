# Interaction Simulation Logic

This document explains how the interaction simulation works in the prototype.

## Overview

The prototype uses optimistic UI updates, toasts, modals, and client-side state management to simulate real interactions without a backend.

## Components

### 1. Toast Notifications (`useToast`)

**Purpose:** Show temporary success/error/info messages.

**Implementation:**
- Context provider wraps the app in `layout.tsx`
- Toast container fixed at top-right
- Auto-dismisses after 3 seconds
- Manual dismiss with close button
- Three types: success (green), error (red), info (blue)

**Usage:**
```typescript
const { showSuccess, showError, showInfo } = useToast();
showSuccess('Idea created successfully!');
```

**Logic:**
- Toasts stored in React state array
- Each toast has unique ID
- Removed after timeout or manual close
- Animated slide-in from right

---

### 2. Modal Confirmations (`Modal`)

**Purpose:** Confirm actions before execution.

**Implementation:**
- Reusable modal component with backdrop
- ESC key to close
- Click outside to close
- Customizable title, content, buttons
- Prevents body scroll when open

**Usage:**
```typescript
<Modal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Confirm Interest"
  onConfirm={handleConfirm}
>
  <p>Are you sure?</p>
</Modal>
```

**Logic:**
- Controlled by `isOpen` prop
- Body overflow hidden when open
- Event listeners for ESC key
- Click outside closes modal

---

### 3. Interest Button (`InterestButton`)

**Purpose:** Express interest with confirmation and optimistic updates.

**Flow:**
1. User clicks button → Modal appears
2. User confirms → Button shows "Processing..."
3. Optimistically update UI (button disabled, shows "✓ Interested")
4. Call `createInterest()` API function
5. Show success toast
6. If collaboration → Add to inbox
7. Refresh idea data to show updated interest count

**Optimistic UI:**
- Button state changes immediately (before API call completes)
- Interest count increments optimistically in `IdeaDetail`
- Button disabled after click to prevent duplicates

**Code:**
```typescript
// Optimistic update
setHasInterested(true);

// API call
await createInterest(ideaId, personId, interestType);

// Success feedback
showSuccess('Interest expressed successfully!');
```

---

### 4. Collaboration Inbox (`useInbox`)

**Purpose:** Simulate receiving collaboration requests.

**Implementation:**
- Context provider stores requests in React state
- Unread count badge in header
- Requests stored in memory (lost on refresh)
- Each request has: idea, requester, message, timestamp

**Flow:**
1. User clicks "I want to collaborate" on an idea
2. Confirmation modal appears
3. On confirm → Request added to inbox
4. Toast: "Collaboration request sent! Check your inbox."
5. Header shows unread count badge
6. User can view requests at `/inbox`
7. Mark as read, remove requests

**Data Structure:**
```typescript
interface CollaborationRequest {
  id: string;
  ideaId: string;
  ideaTitle: string;
  requesterName: string;
  requesterRole: string;
  message?: string;
  createdAt: string;
  read: boolean;
}
```

**Logic:**
- Requests added to array in state
- Unread count calculated from `read: false` items
- Header badge updates automatically
- Inbox page shows all requests with actions

---

### 5. Idea Creation (`IdeaForm`)

**Purpose:** Create new ideas with immediate feedback.

**Flow:**
1. User fills form and submits
2. Validation runs
3. On success:
   - Show success toast
   - Dispatch custom event `ideaCreated`
   - Redirect to browse page after 500ms
4. Browse page listens for event and refreshes data
5. New idea appears immediately in feed

**Optimistic UI:**
- Toast shows immediately
- Custom event notifies browse page
- Browse page refetches data
- New idea appears without full page reload

**Code:**
```typescript
// Create idea
const newIdea = await createIdea(formData);

// Show feedback
showSuccess('Idea created successfully!');

// Notify other pages
window.dispatchEvent(new CustomEvent('ideaCreated'));

// Navigate
router.push('/browse');
```

**Event Listener (Browse Page):**
```typescript
useEffect(() => {
  const handleIdeaCreated = () => {
    // Refetch ideas
    fetchIdeas(filters).then(setIdeas);
  };
  
  window.addEventListener('ideaCreated', handleIdeaCreated);
  return () => window.removeEventListener('ideaCreated', handleIdeaCreated);
}, [filters]);
```

---

### 6. Interest Counter Updates

**Purpose:** Show real-time interest count changes.

**Implementation:**
- `IdeaDetail` component manages local state
- On interest button click:
  1. Optimistically increment counter
  2. Call API to add interest
  3. Refetch full idea data
  4. Update state with fresh data

**Code:**
```typescript
const handleInterestAdded = () => {
  // Optimistic update
  setIdea((prev) => ({
    ...prev,
    interestCount: prev.interestCount + 1,
  }));
  
  // Refetch to get updated interested people list
  setRefreshKey(prev => prev + 1);
};
```

---

## State Management Strategy

### Client-Side State (React Context)
- **Toast state:** Array of active toasts
- **Inbox state:** Array of collaboration requests
- **No persistence:** All state lost on refresh

### Optimistic Updates
- UI updates immediately (before API completes)
- Provides instant feedback
- If API fails, state could be inconsistent (acceptable for prototype)

### Event-Driven Updates
- Custom events for cross-page communication
- Browse page listens for `ideaCreated` event
- Allows immediate updates without polling

---

## User Experience Flow

### Expressing Interest
1. Click "I'm interested" → Modal appears
2. Confirm → Button shows "Processing..."
3. Button changes to "✓ Interested" (disabled)
4. Toast: "Interest expressed successfully!"
5. Interest count increments
6. User appears in interested people list

### Collaborating
1. Click "I want to collaborate" → Modal appears
2. Confirm → Button shows "Processing..."
3. Toast: "Collaboration request sent! Check your inbox."
4. Header shows unread badge (if not already there)
5. Navigate to `/inbox` to see request
6. Request shows idea title, requester info
7. Can mark as read or remove

### Creating Idea
1. Fill form and submit
2. Validation runs
3. Toast: "Idea created successfully! It will appear in the feed."
4. Redirect to browse page
5. New idea appears at top of list
6. No page reload needed

---

## Technical Details

### No Persistence
- All state in React Context (memory only)
- Lost on page refresh
- No localStorage or sessionStorage
- Matches prototype requirements

### No Fake Auth
- Simulated user ID hardcoded: `person-001`
- No login/logout flow
- No user session management
- All interactions as "You" (simulated user)

### No Hacks
- Standard React patterns (Context, hooks, state)
- Custom events for cross-component communication
- No workarounds or temporary solutions
- Clean, maintainable code

---

## Limitations

1. **State Loss:** All interactions lost on refresh
2. **Single User:** Only one simulated user can interact
3. **No Real Notifications:** Inbox only works if user navigates to page
4. **No Conflict Resolution:** Multiple tabs may show inconsistent state
5. **No Undo:** Actions cannot be reversed (by design for prototype)

---

## Future Backend Integration

When adding a real backend:

1. **Toasts:** Keep as-is (client-side feedback)
2. **Modals:** Keep as-is (confirmation UI)
3. **Interest Button:** Replace `createInterest()` with API call
4. **Inbox:** Replace context with API calls to fetch requests
5. **Idea Creation:** Replace event with API call, then redirect
6. **Interest Counter:** Server returns updated count

All UI components remain unchanged - only data fetching layer needs updates.

