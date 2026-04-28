import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";

export function createAuth(env: CloudflareBindings) {
  const sql = neon(env.STANDINGS_DATABASE_URL);
  const db = drizzle(sql, { schema });

  return betterAuth({
    appName: "standings.media",
    basePath: "/api/auth",
    baseURL: env.STANDINGS_BETTER_AUTH_URL,
    secret: env.STANDINGS_BETTER_AUTH_SECRET,
    trustedOrigins: [env.STANDINGS_BETTER_AUTH_URL],
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
    }),
    emailAndPassword: { enabled: true },
  });
}
