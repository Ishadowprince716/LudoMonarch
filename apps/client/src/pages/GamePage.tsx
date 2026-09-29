import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGameSocket } from "../hooks/useGameSocket";
import Board from "../components/Board";

export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get("name") || "Player";
  const { game, error, rollDice, movePiece } = useGameSocket();
  const [inputRoomId, setInputRoomId] = useState(roomId || "");

  if (!game) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Join a Game</h2>
        <input
          value={inputRoomId}
          onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
          placeholder="Enter Room Code"
          style={{ padding: 10, fontSize: 18, textTransform: "uppercase", letterSpacing: 4 }}
        />
        <br /><br />
        <button
          onClick={() => {
            if (inputRoomId) {
              // join handled by useGameSocket - need to trigger join
              window.location.reload();
            }
          }}
          style={{ padding: "10px 24px", fontSize: 16, cursor: "pointer" }}
        >
          Join Game
        </button>
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