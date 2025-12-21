# Backend Entity Mapping

This document explains how the prototype's mock data models map to future backend database entities.

## Current Prototype Architecture

The prototype uses:
- **Pure TypeScript interfaces** for type safety
- **In-memory arrays** for data storage
- **Static mock data** for initial content
- **Helper functions** for data manipulation

## Entity Mappings

### 1. Idea Entity

**Prototype:**
```typescript
interface Idea {
  id: string;
  title: string;
  description: string;
  // ... other fields
  interestedPersonIds: string[];
}
```

**Future Backend:**
```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  category VARCHAR(50) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  contact_email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE idea_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  UNIQUE(idea_id, tag)
);

CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_stage ON ideas(stage);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE FULLTEXT INDEX idx_ideas_search ON ideas(title, description);
```

**Key Changes:**
- Add `user_id` foreign key (replaces `authorName`/`authorRole`)
- Add `status` field for draft/published workflow
- Add `deleted_at` for soft deletes
- Add `updated_at` for version tracking
- Separate `idea_tags` table for many-to-many relationship
- Add database indexes for performance
- Add full-text search index

**Migration Notes:**
- Map prototype `id` strings to UUIDs
- Extract author info from `authorName`/`authorRole` to `user_id`
- Split `tags` array into `idea_tags` table rows
- Set all existing ideas to `status = 'published'`

---

### 2. Person Entity

**Prototype:**
```typescript
interface Person {
  id: string;
  name: string;
  role: PersonRole;
  // ... other fields
  interests: string[];
}
```

**Future Backend:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- student, alumni, professor, etc.
  affiliation VARCHAR(255),
  avatar_url VARCHAR(500),
  bio TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP NULL
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  skills TEXT[],
  experience JSONB,
  social_links JSONB,
  preferences JSONB
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Key Changes:**
- Rename `Person` to `User` (standard naming)
- Add authentication fields (`email`, `password_hash`)
- Add `email_verified` and `profile_complete` flags
- Separate `user_profiles` table for extended data
- Add `last_login_at` for activity tracking
- Remove `interests` array (handled via `interest_signals` table)
- Remove `interestType` (handled per interest signal)

**Migration Notes:**
- Generate UUIDs for all users
- Create authentication records for each user
- Map prototype `email` placeholders to real emails (user input)
- Extract `interests` array to `interest_signals` table

---

### 3. Interest Signal Entity

**Prototype:**
```typescript
interface InterestSignal {
  id: string;
  ideaId: string;
  personId: string;
  interestType: InterestType;
  createdAt: string;
}
```

**Future Backend:**
```sql
CREATE TABLE interest_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interest_type VARCHAR(50) NOT NULL, -- collaborate, fund, explore, mentor
  message TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, withdrawn
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

CREATE INDEX idx_interest_signals_idea_id ON interest_signals(idea_id);
CREATE INDEX idx_interest_signals_user_id ON interest_signals(user_id);
CREATE INDEX idx_interest_signals_type ON interest_signals(interest_type);
```

**Key Changes:**
- Add `status` field (allows users to withdraw interest)
- Add `message` field (optional communication)
- Add `updated_at` for tracking changes
- Add unique constraint on `(idea_id, user_id)` to prevent duplicates
- Rename `personId` to `user_id` for consistency

**Migration Notes:**
- Map all prototype interest signals to new table
- Set all existing signals to `status = 'active'`
- Preserve `interestType` as `interest_type`

---

### 4. Funding Opportunity Entity

**Prototype:**
```typescript
interface FundingOpportunity {
  id: string;
  ideaId: string;
  amount?: number;
  interestedInvestorIds: string[];
  status: FundingStatus;
}
```

**Future Backend:**
```sql
CREATE TABLE funding_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  stage VARCHAR(50), -- seed, series-a, etc.
  status VARCHAR(50) NOT NULL, -- open, in_discussion, closed, funded
  terms TEXT,
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE funding_investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funding_opportunity_id UUID REFERENCES funding_opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  commitment_amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'interested', -- interested, committed, withdrawn
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(funding_opportunity_id, user_id)
);

CREATE INDEX idx_funding_opportunities_idea_id ON funding_opportunities(idea_id);
CREATE INDEX idx_funding_opportunities_status ON funding_opportunities(status);
```

**Key Changes:**
- Separate `funding_opportunities` and `funding_investors` tables
- Add `currency` field for international support
- Add `terms` and `deadline` fields
- Add `commitment_amount` per investor
- Add investor `status` tracking
- More granular status values

**Migration Notes:**
- Create funding opportunities only for ideas with `stage = 'SeekingFunding'`
- Map `interestedInvestorIds` to `funding_investors` table
- Set default amounts if not specified

---

## Data Relationships

### Current Prototype Relationships

```
Idea (1) ──< (many) InterestSignal (many) >── (1) Person
```

### Future Backend Relationships

```
User (1) ──< (many) Idea
User (1) ──< (many) InterestSignal (many) >── (1) Idea
Idea (1) ──< (many) FundingOpportunity (many) >── (many) User (via FundingInvestors)
```

---

## Additional Backend Features

### 1. Notifications

**New Table:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- interest, funding, comment, etc.
  entity_type VARCHAR(50), -- idea, interest_signal, etc.
  entity_id UUID,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
```

### 2. Comments/Discussions

**New Table:**
```sql
CREATE TABLE idea_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES idea_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);
```

### 3. Analytics

**New Table:**
```sql
CREATE TABLE idea_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- view, interest, share, etc.
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Migration Strategy

### Phase 1: Export Prototype Data

1. Export all mock data as JSON files
2. Map string IDs to UUIDs
3. Create user accounts for all simulated people
4. Preserve relationships via foreign keys

### Phase 2: Database Schema

1. Create all tables with proper constraints
2. Set up indexes for performance
3. Add database-level validations
4. Create migration scripts

### Phase 3: API Development

1. Build REST or GraphQL API
2. Implement authentication middleware
3. Add authorization rules
4. Create data validation layers

### Phase 4: Real-time Features

1. Add WebSocket support for live updates
2. Implement notification system
3. Add activity feeds
4. Create real-time interest counters

---

## Key Differences Summary

| Aspect | Prototype | Backend |
|--------|-----------|---------|
| **Storage** | In-memory arrays | PostgreSQL database |
| **IDs** | String literals | UUIDs |
| **Relationships** | Arrays of IDs | Foreign keys |
| **Authentication** | None | JWT/OAuth |
| **Persistence** | None (resets on refresh) | Permanent storage |
| **Validation** | TypeScript types | Database constraints + API validation |
| **Search** | Client-side filtering | Full-text search (PostgreSQL) |
| **Real-time** | None | WebSockets/Server-Sent Events |
| **Notifications** | None | Database-driven notification system |

---

## Backward Compatibility

When migrating, maintain compatibility by:
- Using the same TypeScript interfaces on the frontend
- Mapping backend responses to frontend types
- Preserving API response structure
- Keeping enum values consistent

The frontend code should require minimal changes - only the data fetching layer needs updates (from local functions to API calls).

