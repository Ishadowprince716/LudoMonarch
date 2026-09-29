import React, { useState } from "react";
import { useGameSocket } from "../hooks/useGameSocket";
import { useNavigate } from "react-router-dom";

export default function LobbyPage() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const { createGame, joinGame, game, error } = useGameSocket();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!playerName.trim()) return;
    createGame(playerName.trim());
  };

  const handleJoin = () => {
    if (!roomId || !playerName.trim()) return;
    joinGame(roomId.trim().toUpperCase(), playerName.trim());
  };

  // Redirect to game when game is ready
  if (game) {
    navigate(`/game/${game.roomId}?name=${encodeURIComponent(playerName)}`);
  }

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Ludo Monarch</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Your Name"
          style={{ padding: 12, fontSize: 16 }}
        />

        <button onClick={handleCreate} style={primaryBtn}>Create Game</button>

        <hr />

        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          placeholder="Room Code"
          style={{ padding: 12, fontSize: 16, textTransform: "uppercase", letterSpacing: 3 }}
        />
        <button onClick={handleJoin} style={primaryBtn}>Join Game</button>
      </div>

      {error && <p style={{ color: "#e74c3c", marginTop: 16 }}>{error}</p>}

      {game && (
        <div style={{ marginTop: 20, padding: 16, background: "#2a2a4a", borderRadius: 12 }}>
          <p>Room: <strong>{game.roomId}</strong></p>
          <p>Players: {game.players.length}/4</p>
          <p>Status: {game.status}</p>
        </div>
      )}
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  padding: 12, fontSize: 16, background: "#e74c3c", color: "#fff",
  border: "none", borderRadius: 8, cursor: "pointer",
};