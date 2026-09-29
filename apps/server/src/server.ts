import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { createClient, RedisClientType } from "redis";
import healthRouter from "./routes/health";
import { registerGameSocket } from "./socket/gameSocket";

export const prisma = new PrismaClient();

let pubClient: RedisClientType | null = null;
let subClient: RedisClientType | null = null;

async function initRedis(): Promise<void> {
  if (!process.env.REDIS_URL) return;
  try {
    pubClient = createClient({ url: process.env.REDIS_URL });
    subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    console.log("Redis connected");
  } catch (err) {
    console.warn("Redis connection failed, running without Redis:", err);
    pubClient = null;
    subClient = null;
  }
}

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/api", healthRouter);

// Serve built frontend static files
app.use(express.static(path.join(__dirname, "../../client/dist")));

// SPA catch-all: serve index.html for any non-API, non-Socket route
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
  transports: ["websocket", "polling"],
});

(async () => {
  await initRedis();
  if (pubClient && subClient) {
    const { createAdapter } = await import("@socket.io/redis-adapter");
    io.adapter(createAdapter(pubClient, subClient));
  }
  io.on("connection", (socket) => {
    registerGameSocket(io, socket, prisma);
  });
})();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Ludo Monarch server running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  if (pubClient) await pubClient.quit();
  if (subClient) await subClient.quit();
  process.exit(0);
});