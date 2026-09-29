import React from "react";

type Props = {
  diceValue: number | null;
  onRoll: () => void;
  disabled: boolean;
  lastAction?: string;
};

export default function Dice({ diceValue, onRoll, disabled, lastAction }: Props) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 72, fontWeight: "bold", color: "#f1c40f",
          background: "#16213e", borderRadius: 16, padding: "10px 30px",
          display: "inline-block", minWidth: 90, textAlign: "center",
        }}
      >
        {diceValue ?? "?"}
      </div>
      <br />
      <button
        onClick={onRoll}
        disabled={disabled}
        style={{
          marginTop: 12, padding: "10px 32px", fontSize: 18,
          background: disabled ? "#555" : "#e74c3c", color: "#fff",
          border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        Roll Dice
      </button>
      {lastAction && <p style={{ marginTop: 8, color: "#aaa" }}>{lastAction}</p>}
    </div>
  );
}