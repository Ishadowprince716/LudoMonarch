import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>♟ Ludo Monarch</h1>
      <p style={{ color: "#aaa", marginBottom: 40 }}>Real-time Multiplayer Ludo</p>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/create")} style={btnStyle}>
          🎲 Create Game
        </button>
        <button onClick={() => navigate("/join")} style={btnStyle}>
          🔑 Join Game
        </button>
        <button onClick={() => navigate("/play-local")} style={btnStyle}>
          👥 Play Local
        </button>
        <button onClick={() => navigate("/ai")} style={btnStyle}>
          🤖 Play vs AI
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "16px 32px", fontSize: 18, background: "#e74c3c", color: "#fff",
  border: "none", borderRadius: 12, cursor: "pointer", minWidth: 180,
};