import { GameState, Player } from "@ludo/shared";
import { BOARD_SIZE, HOME_LANE_START, FINISHED_POSITION, PIECES_PER_PLAYER } from "./constants";

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function getCurrentPlayer(game: GameState): Player | null {
  return game.players[game.currentPlayerIndex] ?? null;
}

export function getLegalMoves(game: GameState, playerId: string, pieceId: number): boolean {
  const player = game.players[game.currentPlayerIndex];
  if (!player || player.id !== playerId) return false;
  if (game.diceValue === null) return false;

  const piece = player.pieces.find((p) => p.id === pieceId);
  if (!piece || piece.finished) return false;

  // Yard requires a 6 to enter
  if (piece.position === -1 && game.diceValue !== 6) return false;

  const targetPos = piece.position === -1 ? 0 : piece.position + game.diceValue;

  // Can't land on own piece
  if (isOwnPieceBlocking(game, player, targetPos, pieceId)) return false;

  // Exact roll required to finish
  if (targetPos > FINISHED_POSITION) return false;

  return true;
}

function isOwnPieceBlocking(game: GameState, player: Player, targetPos: number, excludePieceId: number): boolean {
  return player.pieces.some(
    (p) => p.id !== excludePieceId && !p.finished && p.position === targetPos
  );
}

export function movePiece(game: GameState, playerId: string, pieceId: number): GameState {
  const player = getCurrentPlayer(game);
  if (!player || player.id !== playerId) throw new Error("Not your turn");
  if (!getLegalMoves(game, playerId, pieceId)) throw new Error("Illegal move");

  const piece = player.pieces.find((p) => p.id === pieceId)!;
  const dice = game.diceValue!;

  // Capture opponent at target
  const targetPos = piece.position === -1 ? 0 : piece.position + dice;

  if (targetPos < BOARD_SIZE) {
    captureOpponent(game, player.color, targetPos);
  }

  // Move piece
  if (piece.position === -1) {
    piece.position = 0;
  } else {
    piece.position += dice;
  }

  // Check if finished
  if (piece.position >= FINISHED_POSITION) {
    piece.position = FINISHED_POSITION;
    piece.finished = true;
  }

  game.diceValue = null;

  // Record turn
  game.turnHistory.push({
    playerId,
    diceValue: dice,
    move: `Moved piece ${pieceId} to ${piece.position}`,
    timestamp: Date.now(),
  });

  // Check winner
  const allFinished = player.pieces.every((p) => p.finished);
  if (allFinished) {
    game.status = "finished";
    game.winnerId = player.id;
    return game;
  }

  // Six = extra turn
  if (dice !== 6) {
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  }

  return game;
}

function captureOpponent(game: GameState, currentColor: string, position: number): void {
  for (const player of game.players) {
    if (player.color === currentColor) continue;
    const piece = player.pieces.find(
      (p) => !p.finished && p.position === position
    );
    if (piece) {
      piece.position = -1; // Send back to yard
    }
  }
}

export function getPlayerPiecesInYard(player: Player): number {
  return player.pieces.filter((p) => p.position === -1).length;
}

export function getPlayerFinishedPieces(player: Player): number {
  return player.pieces.filter((p) => p.finished).length;
}