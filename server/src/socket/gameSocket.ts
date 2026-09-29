import { Server as SocketIOServer, Socket } from "socket.io";
import { GameState } from "../types";
import {
  createInitialGame,
  addPlayerToGame,
  handleRollDice,
  handleMovePiece,
  handleDisconnect,
} from "../game/gameEngine";
import { chooseAIMove } from "../game/ai";
import { rollDice } from "../game/gameRules";

const games = new Map<string, GameState>();

export function registerGameSocket(io: SocketIOServer, socket: Socket): void {
  socket.on("create-game", ({ playerName }: { playerName: string }, callback) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const game = createInitialGame(roomId, playerName, socket.id);
    games.set(roomId, game);
    socket.join(roomId);
    callback({ roomId, game });
    io.to(roomId).emit("game-updated", game);
  });

  socket.on("join-game", ({ roomId, playerName }: { roomId: string; playerName: string }, callback) => {
    const game = games.get(roomId);
    if (!game) {
      callback({ error: "Game not found" });
      return;
    }
    if (game.players.length >= 4) {
      callback({ error: "Game is full" });
      return;
    }

    socket.join(roomId);
    addPlayerToGame(game, playerName, socket.id);
    callback({ game });
    io.to(roomId).emit("game-updated", game);
  });

  socket.on("roll-dice", ({ roomId }: { roomId: string }) => {
    const game = games.get(roomId);
    if (!game || game.status !== "playing") return;

    const updated = handleRollDice(game, socket.id);
    if (updated) {
      io.to(roomId).emit("game-updated", updated);
    }
  });

  socket.on("move-piece", ({ roomId, pieceId }: { roomId: string; pieceId: number }) => {
    const game = games.get(roomId);
    if (!game) return;

    const success = handleMovePiece(game, socket.id, pieceId);
    if (success) {
      io.to(roomId).emit("game-updated", game);
      // Trigger AI turn if next player is AI
      const nextPlayer = game.players[game.currentPlayerIndex];
      if (game.status === "playing" && nextPlayer?.isAI) {
        scheduleAITurn(io, games, roomId);
      }
    } else {
      socket.emit("game-error", { message: "Illegal move" });
    }
  });

  socket.on("create-ai-game", ({ playerName, aiCount }: { playerName: string; aiCount?: number }, callback) => {
    const numAI = Math.min(aiCount ?? 1, 3);
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const game = createInitialGame(roomId, playerName, socket.id);

    for (let i = 0; i < numAI; i++) {
      addPlayerToGame(game, `AI-${i + 1}`, `ai-${roomId}-${i}`);
      game.players[i + 1].isAI = true;
      game.players[i + 1].connected = true;
    }

    games.set(roomId, game);
    socket.join(roomId);
    callback({ roomId, game });
    io.to(roomId).emit("game-updated", game);
  });

  socket.on("leave-game", ({ roomId }: { roomId: string }) => {
    socket.leave(roomId);
    const game = games.get(roomId);
    if (game) {
      const player = game.players.find((p) => p.id === socket.id);
      if (player) {
        player.connected = false;
        io.to(roomId).emit("game-updated", game);
      }
    }
  });

  socket.on("disconnect", () => {
    for (const [, game] of games) {
      const player = game.players.find((p) => p.id === socket.id);
      if (player) {
        handleDisconnect(game, socket.id);
        io.to(game.roomId).emit("game-updated", game);
      }
    }
  });
}

function scheduleAITurn(io: SocketIOServer, games: Map<string, GameState>, roomId: string) {
  setTimeout(() => {
    const game = games.get(roomId);
    if (!game || game.status !== "playing") return;
    const player = game.players[game.currentPlayerIndex];
    if (!player?.isAI) return;
    if (game.diceValue !== null) return;

    // AI rolls dice
    game.diceValue = rollDice();
    game.lastAction = `${player.name} rolled ${game.diceValue}`;
    io.to(roomId).emit("game-updated", game);

    // AI picks a move after a "thinking" delay
    setTimeout(() => {
      const g = games.get(roomId);
      if (!g || g.status !== "playing") return;
      const move = chooseAIMove(g, player.id);
      if (move !== null) {
        handleMovePiece(g, player.id, move);
        io.to(roomId).emit("game-updated", g);
        // If still AI's turn (rolled 6), loop again
        if (g.status === "playing" && g.players[g.currentPlayerIndex]?.isAI) {
          scheduleAITurn(io, games, roomId);
        }
      }
    }, 700);
  }, 800);
}