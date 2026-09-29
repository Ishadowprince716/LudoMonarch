import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGameSocket } from "../hooks/useGameSocket";
import { useAuth } from "../context/AuthContext";
import Board from "../components/Board";

export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const playerName = user?.username || "Player";
  const { game, error, rollDice, movePiece } = useGameSocket();
  const [inputRoomId, setInputRoomId] = useState(roomId || "");

  if (!game) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Joining room {inputRoomId}…</h2>
        {error && <p style={{ color: "#e74c3c" }}>{error}</p>}
      </div>
    );
  }

  const myPlayer = game.players.find((p) => p.name === playerName);

  return (
    <div>
      {error && <div style={{ background: "#c0392b", padding: 8, textAlign: "center" }}>{error}</div>}
      <Board
        game={game}
        myPlayerId={myPlayer?.id || ""}
        onRoll={() => rollDice(game.roomId)}
        onMove={(id: number) => movePiece(game.roomId, id)}
      />
    </div>
  );
}