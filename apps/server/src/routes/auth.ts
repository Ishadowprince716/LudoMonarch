import { Router } from "express";
import { prisma } from "../prisma";
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "ludo-dev-secret";

// --- password helpers (Node built-in crypto, no deps) ---
function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(pw, salt, 64);
  const real = Buffer.from(hash, "hex");
  return test.length === real.length && timingSafeEqual(test, real);
}

// --- JWT-like token (HMAC-SHA256, base64url) ---
function b64url(s: string): string {
  return Buffer.from(s).toString("base64url");
}

function signToken(userId: string, username: string): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Date.now();
  const payload = b64url(
    JSON.stringify({ sub: userId, name: username, iat: now, exp: now + 7 * 24 * 60 * 60 * 1000 })
  );
  const sig = createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${sig}`;
}

export function verifyToken(token: string) {
  try {
    const [header, payload, sig] = token.split(".");
    const expected = createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");
    if (sig !== expected) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp && data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

// --- routes ---
authRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email and password required" });
    }
    if (username.length < 3 || password.length < 6) {
      return res
        .status(400)
        .json({ error: "username min 3 chars, password min 6 chars" });
    }
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) {
      return res.status(409).json({ error: "username or email already taken" });
    }
    const user = await prisma.user.create({
      data: { username, email, passwordHash: hashPassword(password) },
    });
    const token = signToken(user.id, user.username);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "registration failed" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "invalid email or password" });
    }
    const token = signToken(user.id, user.username);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "login failed" });
  }
});

authRouter.get("/me", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "not authenticated" });
  res.json({ user: { id: payload.sub, username: payload.name } });
});
