import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import healthRouter from "./routes/health";
import { registerGameSocket } from "./socket/gameSocket";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/api", healthRouter);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
});

io.on("connection", (socket) => {
  registerGameSocket(io, socket);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Ludo Monarch server running on port ${PORT}`);
});