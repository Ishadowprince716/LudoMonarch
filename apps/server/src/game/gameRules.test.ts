import { describe, it, expect } from "vitest";
import { rollDice, getCurrentPlayer, getLegalMoves, movePiece } from "./gameRules";
import { createInitialGame, addPlayerToGame } from "./gameEngine";

describe("rollDice", () => {
  it("returns a value between 1 and 6", () => {
    for (let i = 0; i < 100; i++) {
      const val = rollDice();
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(6);
    }
  });
});

describe("getCurrentPlayer", () => {
  it("returns the current player", () => {
    const game = createInitialGame("test", "Alice", "p1");
    const player = getCurrentPlayer(game);
    expect(player?.name).toBe("Alice");
  });
});

describe("getLegalMoves", () => {
  it("piece in yard requires dice 6", () => {
    const game = createInitialGame("test", "Alice", "p1");
    game.diceValue = 3;
    expect(getLegalMoves(game, "p1", 0)).toBe(false);
    game.diceValue = 6;
    expect(getLegalMoves(game, "p1", 0)).toBe(true);
  });

  it("piece already on board can move if legal", () => {
    const game = createInitialGame("test", "Alice", "p1");
    game.players[0].pieces[0].position = 5;
    game.diceValue = 3;
    expect(getLegalMoves(game, "p1", 0)).toBe(true);
  });

  it("not your turn blocks move", () => {
    const game = createInitialGame("test", "Alice", "p1");
    addPlayerToGame(game, "Bob", "p2");
    game.diceValue = 3;
    expect(getLegalMoves(game, "p2", 0)).toBe(false);
  });
});

describe("movePiece", () => {
  it("moves a piece out of yard with dice 6", () => {
    const game = createInitialGame("test", "Alice", "p1");
    game.diceValue = 6;
    const result = movePiece(game, "p1", 0);
    expect(result.players[0].pieces[0].position).toBe(0);
  });

  it("moves a piece forward", () => {
    const game = createInitialGame("test", "Alice", "p1");
    game.players[0].pieces[0].position = 5;
    game.diceValue = 3;
    const result = movePiece(game, "p1", 0);
    expect(result.players[0].pieces[0].position).toBe(8);
  });

  it("captures opponent piece", () => {
    const game = createInitialGame("test", "Alice", "p1");
    addPlayerToGame(game, "Bob", "p2");
    game.players[1].pieces[0].position = 0; // Bob's piece at entry square
    game.diceValue = 6;
    game.currentPlayerIndex = 0;
    const result = movePiece(game, "p1", 0);
    expect(result.players[1].pieces[0].position).toBe(-1);
  });
});