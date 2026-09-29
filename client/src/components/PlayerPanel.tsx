import React from "react";
import { Color } from "../game/types";

const COLORS: Record<Color, string> = {
  red: "#e74c3c",
  blue: "#3498db",
  green: "#2ecc71",
  yellow: "#f1c40f",
};

type Props = {
  player: { name: string; color: Color; pieces: { id: number; position: number; finished: boolean }[] };
  isCurrent: boolean;
};

export default function PlayerPanel({ player, isCurrent }: Props) {
  const color = COLORS[player.color];
  const finished = player.pieces.filter((p) => p.finished).length;
  const inYard = player.pieces.filter((p) => p.position === -1).length;

  return (
    <div
      style={{
        background: isCurrent ? "#2a2a4a" : "#16213e",
        border: `3px solid ${color}`,
        borderRadius: 12,
        padding: 16,
        minWidth: 180,
        opacity: isCurrent ? 1 : 0.7,
      }}
    >
      <h3 style={{ color, marginBottom: 8 }}>
        {player.name} {isCurrent && "★"}
      </h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {player.pieces.map((p) => (
          <div
            key={p.id}
            title={`Piece ${p.id}: ${p.finished ? "Finished" : p.position === -1 ? "Yard" : p.position}`}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: p.finished ? "#888" : color,
              border: p.position === -1 ? "2px dashed #fff" : "none",
            }}
          />
        ))}
      </div>
      <small>Finished: {finished} | In yard: {inYard}</small>
    </div>
  );
}