import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000");

export default function AIGamePage() {
  const [playerName, setPlayerName] = useState("");
  const [aiCount, setAiCount] = useState(1);
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!playerName.trim()) return;
    socket.emit("create-ai-game", { playerName: playerName.trim(), aiCount }, (result: any) => {
      if (result.error) {
        setError(result.error);
      } else {
        setRoomId(result.roomId);
        navigate(`/game/${result.roomId}?name=${encodeURIComponent(playerName.trim())}`);
      }
    });
  };

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>🤖 Play vs AI</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Your Name"
          style={{ padding: 12, fontSize: 16 }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label>AI Opponents:</label>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setAiCount(n)}
              style={{
                padding: "8px 16px",
                background: aiCount === n ? "#e74c3c" : "#555",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <button onClick={handleCreate} style={{
          padding: 12, fontSize: 16, background: "#e74c3c", color: "#fff",
          border: "none", borderRadius: 8, cursor: "pointer",
        }}>
          Start AI Game
        </button>
      </div>

      {error && <p style={{ color: "#e74c3c", marginTop: 16 }}>{error}</p>}
    </div>
  );
}