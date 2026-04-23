# 🎮 MLBB Tournament Tracker

Auto-tracking tournament system for Mobile Legends: Bang Bang players.

## Features

- 🏆 **Hero-Based Tournaments** - Register for your main hero
- 📊 **Auto-Tracking** - Automatic match updates every 30 minutes
- 🎯 **Points System** - Win/loss points with KDA bonuses
- 📈 **Live Leaderboard** - Real-time rankings
- 🛡️ **Admin Dashboard** - Full tournament control

## Tech Stack

- **Frontend:** Next.js 14, React, TailwindCSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** Prisma Postgres
- **Deployment:** Vercel
- **API:** MLBB Stats API (rone.dev)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/crynxmartinez/mlbb.git
cd mlbb

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma db push
npx prisma generate

# Seed admin user
npm run db:seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- Email: `el@mlbb.com`
- Password: `el123`

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## Project Structure

```
mlbb/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## License

© 2026 MLBB Tournament Tracker

## Support

For issues or questions, please open an issue on GitHub.
