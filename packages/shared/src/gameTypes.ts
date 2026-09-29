export type Color = "red" | "blue" | "green" | "yellow";

export type Piece = {
  id: number;
  position: number; // -1 = yard, 0-51 = board, 52-55 = home lane, 56 = finished
  finished: boolean;
};

export type Player = {
  id: string;
  name: string;
  color: Color;
  pieces: Piece[];
  connected: boolean;
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
  // Client -> Server
  "create-game": { playerName: string };
  "join-game": { roomId: string; playerName: string };
  "leave-game": { roomId: string };
  "roll-dice": { roomId: string };
  "move-piece": { roomId: string; pieceId: number };
  "chat-message": { roomId: string; message: string };
  "reconnect": { roomId: string; playerName: string };

  // Server -> Client
  "game-updated": GameState;
  "game-error": { message: string };
  "chat": { playerName: string; message: string };
  "player-joined": Player;
  "player-left": string;
};