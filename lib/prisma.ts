import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const connectionString = process.env.DATABASE_URL ?? "";

// TLS handling for the underlying `pg` driver.
//
// Local Postgres (docker compose) speaks plain, unencrypted TCP, so we must NOT
// attempt TLS there or the connection is rejected with "server does not support
// SSL connections".
//
// Managed Postgres (DigitalOcean) *requires* TLS. Its server certificate is
// signed by DigitalOcean's own CA, which Node does not trust by default — that
// mismatch is exactly what produces the "TlsConnectionError" on deploy. If a CA
// certificate is provided via DATABASE_CA_CERT we verify against it (the secure
// option); otherwise we fall back to an encrypted-but-unverified connection,
// which is equivalent to `sslmode=no-verify`.
function sslConfig(): false | { ca: string } | { rejectUnauthorized: false } {
  let host = "";
  try {
    host = new URL(connectionString).hostname;
  } catch {
    // Empty or malformed URL: let the client surface the real error at connect
    // time rather than guessing here.
  }

  const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";
  if (isLocal) return false;

  const ca = process.env.DATABASE_CA_CERT;
  return ca ? { ca } : { rejectUnauthorized: false };
}

const adapter = new PrismaPg({ connectionString, ssl: sslConfig() });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
