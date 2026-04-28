import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export default betterAuth({
  appName: "takeoff",
  basePath: "/api/auth",
  database: drizzleAdapter({} as any, { provider: "pg", usePlural: true }),
  emailAndPassword: { enabled: true },
});
