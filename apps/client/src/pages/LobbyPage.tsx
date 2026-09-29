import React, { useState } from "react";
import { useGameSocket } from "../hooks/useGameSocket";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LobbyPage() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [roomId, setRoomId] = useState("");
  const { createGame, joinGame, game, error, connected } = useGameSocket();
  const navigate = useNavigate();
  const { user } = useAuth();
  const playerName = user?.username || "Player";

  const handleCreate = () => createGame(playerName);
  const handleJoin = () => {
    if (!roomId.trim()) return;
    joinGame(roomId.trim().toUpperCase(), playerName);
  };

  if (game) navigate(`/game/${game.roomId}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      <div className="max-w-lg mx-auto px-6 py-12">
        <button onClick={() => navigate("/")} className="text-purple-300/70 hover:text-white text-sm mb-8 inline-flex items-center gap-1 transition-all">← Back to home</button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{mode === "create" ? "Create a Game" : "Join a Game"}</h1>
          <p className="text-purple-200/50 mt-2">
            Playing as <span className="text-purple-300 font-medium">👑 {playerName}</span>
            {!connected && <span className="text-amber-400/80"> · connecting…</span>}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex gap-2 mb-6 bg-slate-900/50 rounded-xl p-1">
            <button onClick={() => setMode("create")} className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${mode === "create" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" : "text-purple-300/60 hover:text-white"}`}>Create</button>
            <button onClick={() => setMode("join")} className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${mode === "join" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" : "text-purple-300/60 hover:text-white"}`}>Join</button>
          </div>
          {mode === "create" ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎲</div>
              <p className="text-purple-200/60 mb-6">Generate a unique room code, share it with up to 3 friends, and start playing.</p>
              <button onClick={handleCreate} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all">Create Room</button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-purple-200/70 mb-1.5">Room Code</label>
                <input value={roomId} onChange={(e) => setRoomId(e.target.value.toUpperCase())} placeholder="ABCDEF" maxLength={6} className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.3em] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all uppercase" />
              </div>
              <button onClick={handleJoin} disabled={!roomId.trim()} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all">Join Room</button>
            </div>
          )}
          {error && <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
}
