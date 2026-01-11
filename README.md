# Sledify - Glow Tracker

Track your skincare journey with Sledify.

**Live Site**: [sledify.com](https://sledify.com)

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AssiamahS/sledify.com.git
cd sledify.com

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Deployment

This project is deployed on **Cloudflare Pages**. 

Pushing to the `main` branch automatically triggers a deployment.

### Build Settings for Cloudflare Pages

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js version**: 18+

## License

MIT
