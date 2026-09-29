import React from "react";
import { GameState, Color } from "@ludo/shared";
import Dice from "./Dice";
import PlayerPanel from "./PlayerPanel";

const BOARD_SQUARES = 52;
const SAFE_SQUARES = [0, 8, 13, 21, 26, 34];

function getSquareColor(index: number): string {
  if (SAFE_SQUARES.includes(index)) return "#f39c12";
  if (index < 13) return "#c0392b";
  if (index < 26) return "#2980b9";
  if (index < 39) return "#27ae60";
  return "#8e44ad";
}

type Props = {
  game: GameState;
  myPlayerId: string;
  onRoll: () => void;
  onMove: (pieceId: number) => void;
};

export default function Board({ game, myPlayerId, onRoll, onMove }: Props) {
  const myPlayer = game.players.find((p) => p.id === myPlayerId);
  const isMyTurn = myPlayer && game.players[game.currentPlayerIndex]?.id === myPlayerId;
  const canRoll = isMyTurn && game.diceValue === null && game.status === "playing";
  const diceVal = game.diceValue;

  return (
    <div style={{ padding: 20 }}>
      <h2>Ludo Monarch</h2>
      <p>Room: {game.roomId} | Status: {game.status}</p>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
        {game.players.map((p) => (
          <PlayerPanel
            key={p.id}
            player={p}
            isCurrent={game.players[game.currentPlayerIndex]?.id === p.id}
          />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SQUARES}, 1fr)`,
          gap: 2, maxWidth: 700, margin: "0 auto",
        }}
      >
        {Array.from({ length: BOARD_SQUARES }, (_, i) => {
          const occupant = game.players.find((p) =>
            p.pieces.some((pc) => pc.position === i && !pc.finished)
          );
          return (
            <div
              key={i}
              title={`Square ${i}`}
              style={{
                background: getSquareColor(i),
                border: "1px solid #333",
                borderRadius: 4,
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {occupant ? "●" : ""}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16 }}>
        {myPlayer && diceVal === null && isMyTurn && (
          <button
            onClick={onRoll}
            style={{ padding: "12px 32px", fontSize: 18, background: "#e74c3c", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer" }}
          >
            Roll Dice
          </button>
        )}
        {diceVal !== null && myPlayer && (
          <div>
            <p>Dice: <strong>{diceVal}</strong></p>
            <p style={{ color: "#aaa", fontSize: 14 }}>Click a piece to move it</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {myPlayer && myPlayer.pieces
          .filter((p) => !p.finished)
          .map((p) => {
            const canMove = diceVal !== null && isMyTurn && canMovePiece(game, myPlayer.id, p.id);
            return (
              <button
                key={p.id}
                onClick={() => onMove(p.id)}
                disabled={!canMove}
                title={`Piece ${p.id} pos=${p.position}`}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: p.position === -1 ? "#555" : "#e74c3c",
                  border: canMove ? "3px solid #fff" : "2px solid #666",
                  color: "#fff", cursor: canMove ? "pointer" : "default",
                  fontWeight: "bold",
                }}
              >
                {p.id}
              </button>
            );
          })}
      </div>

      {game.status === "finished" && (
        <div style={{ marginTop: 20, padding: 20, background: "#2a2a4a", borderRadius: 12, textAlign: "center" }}>
          <h1 style={{ color: "#f1c40f" }}>🏆 {game.players.find(p => p.id === game.winnerId)?.name} Wins!</h1>
        </div>
      )}
    </div>
  );
}

function canMovePiece(game: GameState, playerId: string, pieceId: number): boolean {
  const player = game.players.find(p => p.id === playerId);
  if (!player) return false;
  const piece = player.pieces.find(p => p.id === pieceId);
  if (!piece || piece.finished) return false;
  if (game.diceValue === null) return false;
  if (piece.position === -1 && game.diceValue !== 6) return false;
  const target = piece.position === -1 ? 0 : piece.position + game.diceValue;
  if (target > 56) return false;
  return true;
}