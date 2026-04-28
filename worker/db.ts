import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";

export function createDb(env: CloudflareBindings) {
  const sql = neon(env.STANDINGS_DATABASE_URL);
  return drizzle(sql, { schema });
}
