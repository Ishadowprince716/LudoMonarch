# Ludo Monarch

Real-time multiplayer Ludo game built with React + TypeScript + Node.js + Socket.IO.

## Features
- 🎲 Real-time multiplayer (2-4 players)
- 🏠 Online lobby with room codes
- 🤖 AI opponent mode (1-3 AI players)
- 📱 Responsive design
- 🔒 Server-authoritative game logic
- 🔄 Auto reconnection
- 🧪 Unit tests for game rules (8/8 passing)
- 🗄️ Prisma + PostgreSQL (Supabase-ready)

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React + TypeScript + Vite + TailwindCSS |
| Backend | Node.js + Express + Socket.IO + Redis adapter |
| Database | PostgreSQL via Prisma (Supabase-compatible) |
| State management | Socket.IO (server-authoritative) |
| Testing | Vitest (unit) |
| Monorepo | Turborepo (npm workspaces) |
| Deploy | Frontend: Vercel · Backend: Render |

## Quick Start
```bash
# Install all workspaces from repo root
npm install

# Start server (port 5000)
cd apps/server
npm run dev

# Start client (port 5173) — in another terminal
cd apps/client
npm run dev
```

## Project Structure
```
ludo-monarch/
├── apps/
│   ├── client/          → React frontend (Vite + Tailwind)
│   │   ├── src/
│   │   │   ├── components/   → Board, Dice, PlayerPanel
│   │   │   ├── hooks/        → useGameSocket
│   │   │   ├── lib/          → Supabase client
│   │   │   ├── pages/        → Home, Lobby, Game, AI
│   │   │   └── index.css     → Tailwind directives
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.js
│   └── server/          → Node.js + Express + Socket.IO
│       ├── src/
│       │   ├── game/         → gameEngine, gameRules, ai
│       │   ├── socket/       → gameSocket
│       │   ├── routes/       → health
│       │   └── server.ts     → Express + Prisma + Redis
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
├── packages/
│   └── shared/          → Canonical types (@ludo/shared)
│       ├── src/index.ts
│       └── package.json
├── turbo.json           → Turborepo pipeline
├── package.json         → Root workspace config
└── README.md
```

## Environment Variables

### Client (`apps/client/.env.local`)
```
VITE_SERVER_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Server (`apps/server/.env`)
```
PORT=5000
CLIENT_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://postgres:[password]@db.supabase.co:5432/postgres
```

## Integration Status

### ✅ Verified Working
- Monorepo workspace resolution (`@ludo/shared` from both apps)
- Server boots, health endpoint responds on port 5000
- Client builds to `dist/`, dev server serves on 5173
- Socket.IO round-trip: connect → create game → receive `game-updated`
- Vitest: 8/8 tests pass
- TypeScript: both apps compile clean
- TailwindCSS: installed, base CSS imported, config in place

### ❌ Blocked (Environment)
- **Supabase DB**: `prisma db push` fails — no real `DATABASE_URL` (placeholder password in `.env`). Create a Supabase project, set the real connection string, then `npx prisma db push`.
- **Redis**: Docker container can't start — Docker Desktop daemon not running. Start Docker Desktop, then `docker run -d --name ludo-redis -p 6379:6379 redis:7-alpine`, set `REDIS_URL=redis://localhost:6379`, restart server.

## Deployment

### Frontend (Vercel)
```bash
cd apps/client
vercel
```

### Backend (Render)
1. Push to GitHub
2. Create Web Service on Render
3. Build: `cd apps/server && npm install && npm run build`
4. Start: `node dist/server.js`
5. env: `DATABASE_URL`, `REDIS_URL` (optional), `CLIENT_URL`

## Game Rules Implemented
- ✅ Dice roll (1-6)
- ✅ Yard requires 6 to enter
- ✅ Extra turn on rolling 6
- ✅ Capture opponent pieces
- ✅ Safe squares
- ✅ Exact roll to finish
- ✅ Win detection
- ✅ AI with priority-based strategy

## License
MIT