import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const actions = [
    { icon: "🎲", title: "Create Game", desc: "Start a room and invite friends", to: "/create" },
    { icon: "🔑", title: "Join Game", desc: "Enter a room code to play", to: "/join" },
    { icon: "🤖", title: "Play vs AI", desc: "Sharpen your skills offline", to: "/ai" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">♟</span>
            <span className="text-xl font-bold tracking-tight">Ludo Monarch</span>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-4 pr-2 py-1.5">
                <span className="text-sm text-purple-200">👑 {user.username}</span>
                <button onClick={logout} className="bg-white/10 hover:bg-white/20 text-sm text-white rounded-full px-3 py-1 transition-all">Logout</button>
              </div>
            ) : (
              <button onClick={() => navigate("/login")} className="bg-white/10 hover:bg-white/20 text-sm text-white rounded-full px-4 py-1.5 transition-all">Sign In</button>
            )}
          </div>
        </nav>

        <div className="text-center py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium rounded-full px-4 py-1.5 mb-6">✨ Real-time Multiplayer Ludo</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Rule the Board.
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">Claim the Crown.</span>
          </h1>
          <p className="mt-6 text-lg text-purple-200/60 max-w-xl mx-auto">Play classic Ludo with friends in real-time, challenge the AI, or test your strategy against the world.</p>
          <button onClick={() => navigate(user ? "/create" : "/login")} className="mt-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 font-semibold px-8 py-4 rounded-xl shadow-2xl shadow-purple-600/40 hover:shadow-purple-600/60 hover:scale-105 active:scale-95 transition-all">
            {user ? "Start Playing →" : "Get Started →"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pb-16">
          {actions.map((a) => (
            <button key={a.title} onClick={() => (user ? navigate(a.to) : navigate("/login"))} className="group text-left bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 rounded-2xl p-8 transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">{a.icon}</div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-purple-300 transition-all">{a.title}</h3>
              <p className="text-purple-200/50 text-sm">{a.desc}</p>
              <div className="mt-4 text-purple-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all">Play now →</div>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 pb-8">
          {[
            { t: "🎮 2–4 Player Real-time", d: "Server-authoritative rooms, no cheating" },
            { t: "🔒 Secure Accounts", d: "Register, login, and save your progress" },
            { t: "⚡ Instant Matchmaking", d: "Create a room, share the code, play" },
            { t: "🧠 Smart AI Opponents", d: "Practice with challenging AI players" },
          ].map((f) => (
            <div key={f.t} className="flex items-start gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="text-2xl">{f.t.split(" ")[0]}</div>
              <div>
                <div className="font-medium">{f.t.split(" ").slice(1).join(" ")}</div>
                <div className="text-sm text-purple-200/50 mt-0.5">{f.d}</div>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center text-slate-500 text-sm py-8 border-t border-white/5">Ludo Monarch © 2026 — Built with React, Socket.IO & TypeScript</footer>
      </div>
    </div>
  );
}
