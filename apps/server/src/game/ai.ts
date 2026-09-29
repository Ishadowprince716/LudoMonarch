import { GameState, Player } from "@ludo/shared";
import { getCurrentPlayer, getLegalMoves } from "./gameRules";

export function chooseAIMove(game: GameState, aiPlayerId: string): number | null {
  const player = game.players.find((p) => p.id === aiPlayerId);
  if (!player) return null;

  const movablePieces = player.pieces
    .map((p) => ({ piece: p, legal: getLegalMoves(game, aiPlayerId, p.id) }))
    .filter((item) => item.legal);

  if (movablePieces.length === 0) return null;

  // Priority 1: Move a piece that can finish
  const finishing = movablePieces.find((item) => {
    const target = item.piece.position === -1 ? 0 : item.piece.position + (game.diceValue ?? 0);
    return target >= 56;
  });
  if (finishing) return finishing.piece.id;

  // Priority 2: Capture an opponent
  const capturing = movablePieces.find((item) => {
    const target = item.piece.position === -1 ? 0 : item.piece.position + (game.diceValue ?? 0);
    return game.players.some(
      (opp) =>
        opp.id !== aiPlayerId &&
        opp.pieces.some((p) => !p.finished && p.position === target)
    );
  });
  if (capturing) return capturing.piece.id;

  // Priority 3: Move a piece out of the yard
  const outOfYard = movablePieces.find((item) => item.piece.position === -1);
  if (outOfYard) return outOfYard.piece.id;

  // Priority 4: Move the piece closest to home
  const closestToHome = movablePieces.sort(
    (a, b) => b.piece.position - a.piece.position
  )[0];
  return closestToHome ? closestToHome.piece.id : null;
}