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
- 🗄️ Supabase auth + game history (ready)

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + Socket.IO |
| Database | PostgreSQL (Supabase) |
| Testing | Vitest |
| Deploy | Frontend: Vercel · Backend: Render |

## Quick Start

```bash
# Server
cd server
npm install
npm run dev

# Client
cd client
npm install
npm run dev
```

## Project Structure
```
ludo-monarch/
├── client/          → React frontend (Vite)
│   └── src/
│       ├── components/   → Board, Dice, PlayerPanel
│       ├── hooks/        → useGameSocket
│       ├── lib/          → Supabase client
│       └── pages/        → Home, Lobby, Game, AI
├── server/          → Node.js + Socket.IO
│   └── src/
│       ├── game/         → gameEngine, gameRules, ai
│       ├── socket/       → gameSocket
│       └── routes/       → health
├── shared/          → Shared types
├── supabase/        → Database migrations
├── render.yaml      → Render deploy config
└── README.md
```

## Environment Variables

### Client (.env)
```
VITE_SERVER_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Server (.env)
```
PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL=your-postgres-connection-string
```

## Deployment

### Frontend (Vercel)
```bash
cd client
vercel
```

### Backend (Render)
1. Push to GitHub
2. Create Web Service on Render
3. Set build command: `cd server && npm install && npm run build`
4. Set start command: `node dist/server.js`
5. Add environment variables

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