import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// TLS handling for the underlying `pg` driver.
//
// Local Postgres (docker compose) speaks plain, unencrypted TCP, so we must NOT
// attempt TLS there or the connection is rejected with "server does not support
// SSL connections".
//
// Managed Postgres (DigitalOcean) *requires* TLS. Its server certificate is
// signed by DigitalOcean's own CA, which Node does not trust by default — that
// mismatch is what produces "TlsConnectionError: self-signed certificate in
// certificate chain" on deploy.
//
// The catch: `pg` merges the connection string LAST (see
// connection-parameters.js: `Object.assign({}, config, parse(connectionString))`),
// so any `sslmode=...` in DATABASE_URL overrides the `ssl` option we pass here.
// DigitalOcean's URL carries `sslmode=require`, which recent `pg` treats as
// `verify-full` (full verification) — which is why it kept rejecting the cert.
// So we strip the ssl-related query params from the URL and make our own `ssl`
// config authoritative: verify against DATABASE_CA_CERT when provided (secure),
// otherwise fall back to an encrypted-but-unverified connection (equivalent to
// sslmode=no-verify).
const SSL_PARAMS = [
  "sslmode",
  "ssl",
  "sslcert",
  "sslkey",
  "sslrootcert",
  "sslnegotiation",
  "uselibpqcompat",
];

function buildAdapterConfig() {
  const raw = process.env.DATABASE_URL ?? "";

  let host = "";
  let connectionString = raw;
  try {
    const url = new URL(raw);
    host = url.hostname;
    for (const param of SSL_PARAMS) url.searchParams.delete(param);
    connectionString = url.toString();
  } catch {
    // Empty or malformed URL: pass it through unchanged and let the client
    // surface the real error at connect time rather than guessing here.
  }

  const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";
  if (isLocal) {
    return { connectionString, ssl: false as const };
  }

  const ca = process.env.DATABASE_CA_CERT;
  return {
    connectionString,
    ssl: ca ? { ca } : { rejectUnauthorized: false as const },
  };
}

const adapter = new PrismaPg(buildAdapterConfig());

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
