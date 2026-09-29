import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { GameState } from "@ludo/shared";

const socket: Socket = io(
  typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : (import.meta.env.VITE_SERVER_URL || "http://localhost:3000")
);

export function useGameSocket() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("game-updated", setGame);
    socket.on("game-error", ({ message }: { message: string }) => setError(message));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("game-updated");
      socket.off("game-error");
    };
  }, []);

  const createGame = useCallback((playerName: string) => {
    socket.emit("create-game", { playerName }, (result: any) => {
      if (result.error) setError(result.error);
    });
  }, []);

  const joinGame = useCallback((roomId: string, playerName: string) => {
    socket.emit("join-game", { roomId, playerName }, (result: any) => {
      if (result.error) setError(result.error);
    });
  }, []);

  const rollDice = useCallback((roomId: string) => {
    socket.emit("roll-dice", { roomId });
  }, []);

  const movePiece = useCallback((roomId: string, pieceId: number) => {
    socket.emit("move-piece", { roomId, pieceId });
  }, []);

  const createAIGame = useCallback((playerName: string, aiCount?: number) => {
    socket.emit("create-ai-game", { playerName, aiCount }, (result: any) => {
      if (result.error) setError(result.error);
    });
  }, []);

  return { game, error, connected, createGame, joinGame, rollDice, movePiece, createAIGame, setError };
}