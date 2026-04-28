import { Hono } from "hono";
import { cors } from "hono/cors";
import * as Sentry from "@sentry/cloudflare";
import { createAuth } from "./auth";

type Bindings = CloudflareBindings;

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.BETTER_AUTH_URL,
    allowHeaders: ["Content-Type", "Authorization", "User-Agent"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });
  return corsMiddleware(c, next);
});

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  return createAuth(c.env).handler(c.req.raw);
});

app.get("/api/health", (c) => c.json({ status: "ok" }));

export default Sentry.withSentry(
  (env: Bindings) => ({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    sendDefaultPii: true,
  }),
  app,
);
