# Startup Hub

A platform for connecting startup ideas with people who want to collaborate, fund, or mentor.

## Features

- User authentication and authorization
- Idea submission and browsing
- Interest signaling (collaborate, fund, mentor)
- Notification system
- User profiles
- Dark mode support

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Yarn or npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp env.example.txt .env
```

4. Configure your `.env` file with:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Secret for NextAuth (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` - Your application URL

5. Run database migrations:
```bash
yarn db:migrate
```

6. Seed the database (optional):
```bash
yarn db:seed
```

### Development

```bash
yarn dev
```

### Testing

Run tests:
```bash
yarn test
```

Run tests in watch mode:
```bash
yarn test:watch
```

Run tests with coverage:
```bash
yarn test:coverage
```

### Building

```bash
yarn build
```

## Project Structure

```
src/
├── app/              # Next.js app router pages and API routes
├── components/      # React components
├── lib/             # Utilities, hooks, and configurations
├── types/           # TypeScript type definitions
└── __tests__/       # Test files
```

## Tech Stack

- **Framework**: Next.js 14
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Language**: TypeScript

## License

Private
