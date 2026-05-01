import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

type NeonDb = ReturnType<typeof drizzleNeon<typeof schema>>;

export function createDb(env: CloudflareBindings): NeonDb {
  if (env.USE_LOCAL_DB) {
    const client = postgres(env.DATABASE_URL);
    return drizzlePg(client, { schema }) as unknown as NeonDb;
  }
  return drizzleNeon(neon(env.DATABASE_URL), { schema });
}
