import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { Role, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "pdpsi_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// --- Tokens -----------------------------------------------------------------

/** SHA-256 hash, used so we never store raw session/verification tokens. */
export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** A cryptographically random token plus its hash for storage. */
export function generateToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("hex");
  return { raw, hash: hashToken(raw) };
}

// --- Passwords --------------------------------------------------------------

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- Sessions ---------------------------------------------------------------

/**
 * Create a login session for a user and set the session cookie. Only callable
 * from Route Handlers / Server Actions (it writes a cookie).
 */
export async function createSession(userId: string): Promise<void> {
  const { raw, hash } = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({ data: { id: hash, userId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Log the current user out: delete their session row and clear the cookie. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (raw) {
    await prisma.session.delete({ where: { id: hashToken(raw) } }).catch(() => {});
    cookieStore.delete(SESSION_COOKIE);
  }
}

/** The signed-in user, or null. Safe to call from Server Components. */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const session = await prisma.session.findUnique({
    where: { id: hashToken(raw) },
    include: { user: true },
  });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session.user;
}

// --- Authorization helpers --------------------------------------------------

export function hasRole(user: User | null, ...roles: Role[]): boolean {
  return user !== null && roles.includes(user.role);
}

/** For Server Components: send anonymous visitors to the login page. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** For Server Components: require one of the given roles, else redirect. */
export async function requireRole(...roles: Role[]): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect("/");
  return user;
}

/**
 * Emails listed in the ADMIN_EMAILS env var (comma-separated) are granted the
 * ADMIN role automatically when they sign up. This is how the very first admin
 * is bootstrapped without touching the database by hand.
 */
export function isAdminEmail(email: string): boolean {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.trim().toLowerCase());
}
