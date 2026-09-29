export type Color = "red" | "blue" | "green" | "yellow";

export type Piece = {
  id: number;
  position: number;
  finished: boolean;
};

export type Player = {
  id: string;
  name: string;
  color: Color;
  pieces: Piece[];
  connected: boolean;
  isAI?: boolean;
  score?: number;
};

export type GameState = {
  roomId: string;
  status: "waiting" | "playing" | "finished";
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  winnerId?: string;
  lastAction?: string;
  turnHistory: TurnEntry[];
};

export type TurnEntry = {
  playerId: string;
  diceValue: number;
  move: string;
  timestamp: number;
};