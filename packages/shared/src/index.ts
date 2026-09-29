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

export type SocketEvents = {
  "create-game": { playerName: string };
  "join-game": { roomId: string; playerName: string };
  "leave-game": { roomId: string };
  "roll-dice": { roomId: string };
  "move-piece": { roomId: string; pieceId: number };
  "chat-message": { roomId: string; message: string };
  "reconnect": { roomId: string; playerName: string };
  "game-updated": GameState;
  "game-error": { message: string };
  "chat": { playerName: string; message: string };
  "player-joined": Player;
  "player-left": string;
};
