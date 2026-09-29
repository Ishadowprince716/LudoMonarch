import { io } from "socket.io-client";

const s = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  reconnection: false,
  timeout: 5000,
});

let connected = false;
let gameCreated = false;

s.on("connect", () => {
  connected = true;
  console.log("✅ Connected to server");
  s.emit("create-game", { playerName: "TestPlayer" }, (r: any) => {
    if (r.error) {
      console.log("❌ Game error:", r.error);
      process.exit(1);
    }
    gameCreated = true;
    console.log("✅ Game created: room=" + r.roomId + " status=" + r.game.status);
    console.log("   Players: " + r.game.players.length);
    s.disconnect();
  });
});

s.on("connect_error", (e: any) => {
  console.log("❌ Connection failed:", e.message);
  process.exit(1);
});

s.on("disconnect", () => {
  if (connected && gameCreated) {
    console.log("\n✅ INTEGRATION TEST PASSED");
    process.exit(0);
  }
});

setTimeout(() => {
  console.log("❌ Timeout");
  process.exit(1);
}, 10000);
