# Axle Truck - Fleet Tracking Platform

Real-time fleet management and tracking system for logistics operations.

## Features

- **GPS Tracking** - Real-time location tracking for every vehicle
- **Fleet Overview** - Monitor all trucks at a glance
- **Driver Management** - Track driver hours and performance
- **Fuel Analytics** - Monitor consumption and optimize routes
- **Live Telemetry** - Speed, fuel, engine temp, hours active

## Tech Stack

- **React 18** + **TypeScript** (strict mode)
- **Vite** - Lightning fast builds with optimized chunking
- **Tailwind CSS** + **shadcn/ui** components
- **Zustand** - Lightweight state management with persistence
- **React Query** - Server state management
- **React Hook Form** + **Zod** - Form handling & validation
- **Vitest** + **React Testing Library** - Testing infrastructure
- **Prettier** + **ESLint** - Code formatting & linting
- **Husky** + **lint-staged** - Pre-commit hooks

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run build:dev` | Build for development |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:ui` | Open Vitest UI |

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── __tests__/     # Component tests
├── hooks/             # Custom React hooks
├── lib/               # Utilities and helpers
│   ├── utils.ts       # General utilities
│   └── env.ts         # Type-safe env variables
├── pages/             # Page components
├── store/             # Zustand stores
│   ├── index.ts       # Store exports
│   └── app-store.ts   # Main app store
└── test/              # Test utilities
    ├── setup.ts       # Test setup
    └── test-utils.tsx # Custom render functions
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_APP_TITLE=Axle Truck Fleet Tracking
VITE_API_URL=http://localhost:3000/api
VITE_DEBUG=false
```

All environment variables must be prefixed with `VITE_` to be exposed to the client.

## State Management

This project uses **Zustand** for global state. Example usage:

```tsx
import { useAppStore } from '@/store';

function MyComponent() {
  const { theme, setTheme } = useAppStore();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current: {theme}
    </button>
  );
}
```

## Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Open Vitest UI
npm run test:ui
```

## Code Quality

Pre-commit hooks automatically run:
- ESLint (with auto-fix)
- Prettier formatting

## License

MIT
