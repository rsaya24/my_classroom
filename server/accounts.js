import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { Router } from "express";
import mongoose from "mongoose";

const derive = promisify(scrypt);
const sessionLifetime = 7 * 24 * 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  secure: process.env.VERCEL === "1" || process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const Account = mongoose.model("Account", new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  salt: { type: String, required: true },
  passwordHash: { type: String, required: true },
}));

const Session = mongoose.model("ClassroomSession", new mongoose.Schema({
  _id: String,
  account: { type: mongoose.Schema.Types.ObjectId, required: true },
  expires: { type: Date, required: true, expires: 0 },
}));

const Attempt = mongoose.model("ClassroomAuthAttempt", new mongoose.Schema({
  _id: String,
  count: Number,
  expires: { type: Date, required: true, expires: 0 },
}));

const hash = value => createHash("sha256").update(value).digest("hex");

function sessionId(req) {
  const cookie = req.headers.cookie?.split(";").map(value => value.trim())
    .find(value => value.startsWith("classroom_session="));
  const token = cookie?.slice("classroom_session=".length);
  return token && /^[a-f0-9]{64}$/.test(token) ? hash(token) : null;
}

export async function requireAccount(req, res, next) {
  const id = sessionId(req);
  const session = id && await Session.findOne({ _id: id, expires: { $gt: new Date() } });
  if (!session) return res.status(401).json({ error: "Sign in to open your classroom." });
  req.accountId = session.account;
  next();
}

async function startSession(req, res, account) {
  const previous = sessionId(req);
  if (previous) await Session.deleteOne({ _id: previous });
  const token = randomBytes(32).toString("hex");
  await Session.create({
    _id: hash(token),
    account: account._id,
    expires: new Date(Date.now() + sessionLifetime),
  });
  res.cookie("classroom_session", token, { ...cookieOptions, maxAge: sessionLifetime });
}

function credentials(req) {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = req.body?.password;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" || password.length < 12 || password.length > 128) return null;
  return { email, password };
}

async function withinAttemptLimit(email) {
  const windowMs = 10 * 60 * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const filter = { _id: hash(email + ":" + bucket) };
  const update = { $inc: { count: 1 }, $setOnInsert: { expires: new Date((bucket + 2) * windowMs) } };
  try {
    const attempt = await Attempt.findOneAndUpdate(filter, update, { upsert: true, new: true });
    return attempt.count <= 12;
  } catch (error) {
    if (error.code !== 11000) throw error;
    const attempt = await Attempt.findOneAndUpdate(filter, update, { new: true });
    return attempt && attempt.count <= 12;
  }
}

export const accounts = Router();

accounts.use((req, res, next) => {
  if (req.method !== "GET" && !req.is("application/json")) {
    return res.status(415).json({ error: "Send a JSON request." });
  }
  next();
});

accounts.post("/:action", async (req, res) => {
  const { action } = req.params;
  if (action === "logout") {
    const id = sessionId(req);
    if (id) await Session.deleteOne({ _id: id });
    res.clearCookie("classroom_session", cookieOptions);
    return res.sendStatus(204);
  }
  if (action !== "signup" && action !== "login") return res.sendStatus(404);

  const input = credentials(req);
  if (!input) return res.status(400).json({ error: "Enter a valid email and a password of 12–128 characters." });
  const { email, password } = input;
  if (!await withinAttemptLimit(email)) {
    return res.status(429).json({ error: "Too many attempts. Try again in 10 minutes." });
  }

  let account;
  if (action === "signup") {
    await Account.init();
    const salt = randomBytes(16).toString("hex");
    const passwordHash = (await derive(password, salt, 64)).toString("hex");
    try {
      account = await Account.create({ email, salt, passwordHash });
    } catch (error) {
      if (error.code !== 11000) throw error;
      return res.status(409).json({ error: "An account already exists for this email. Sign in instead." });
    }
  } else {
    account = await Account.findOne({ email });
    const candidate = await derive(password, account?.salt ?? "00000000000000000000000000000000", 64);
    const stored = account ? Buffer.from(account.passwordHash, "hex") : Buffer.alloc(64);
    if (!timingSafeEqual(candidate, stored) || !account) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }
  }
  await startSession(req, res, account);
  res.json({ email: account.email });
});

accounts.get("/session", requireAccount, async (req, res) => {
  const account = await Account.findById(req.accountId).select("email");
  if (!account) return res.status(401).json({ error: "Sign in to open your classroom." });
  res.json({ email: account.email });
});
