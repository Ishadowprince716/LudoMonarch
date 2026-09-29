import { GameState, Player } from "@ludo/shared";
import { rollDice, getCurrentPlayer, movePiece, getLegalMoves } from "./gameRules";

export function createInitialGame(roomId: string, playerName: string, playerId: string): GameState {
  return {
    roomId,
    status: "waiting",
    players: [
      createPlayer(playerId, playerName, "red"),
    ],
    currentPlayerIndex: 0,
    diceValue: null,
    turnHistory: [],
  };
}

export function addPlayerToGame(game: GameState, playerName: string, playerId: string): GameState {
  const colorIndex = game.players.length;
  const color: GameState["players"][0]["color"] = (["red", "blue", "green", "yellow"] as const)[colorIndex];

  game.players.push(createPlayer(playerId, playerName, color));

  if (game.players.length >= 2) {
    game.status = "playing";
  }

  return game;
}

function createPlayer(id: string, name: string, color: GameState["players"][0]["color"]) {
  return {
    id,
    name,
    color,
    connected: true,
    pieces: Array.from({ length: 4 }, (_, i) => ({
      id: i,
      position: -1,
      finished: false,
    })),
  };
}

export function handleRollDice(game: GameState, socketId: string): GameState | null {
  const player = getCurrentPlayer(game);
  if (!player || player.id !== socketId) return null;
  if (game.diceValue !== null) return null;

  game.diceValue = rollDice();
  game.lastAction = `${player.name} rolled ${game.diceValue}`;
  return game;
}

export function handleMovePiece(game: GameState, socketId: string, pieceId: number): boolean {
  const player = getCurrentPlayer(game);
  if (!player || player.id !== socketId) return false;

  try {
    movePiece(game, socketId, pieceId);
    return true;
  } catch {
    return false;
  }
}

export function handleDisconnect(game: GameState, socketId: string): void {
  const player = game.players.find((p) => p.id === socketId);
  if (player) {
    player.connected = false;
  }
}