import { randomBytes } from "node:crypto";
import type { Express, Request, Response } from "express";
import { parse as parseCookie } from "cookie";
import { getSessionCookieOptions } from "./cookies";

const CLIENT_ID = "9e1f3f99-0725-4d7f-b392-733b1aea3c8a";
const CALLBACK_URL = "https://3000-i3xthsvnvo6aksm19d1gr-039cf7b7.sg2.manus.computer/api/entra/callback";
const AUTHORITY = "https://login.microsoftonline.com/common/oauth2/v2.0";
const STATE_COOKIE = "alazab_entra_state";
const TOKEN_COOKIE = "alazab_entra_access";
const TOKEN_SCOPE = "openid profile email offline_access https://ai.azure.com/.default";

function cookieOptions(req: Request, maxAge: number) {
  const options = getSessionCookieOptions(req);
  return { ...options, maxAge } as const;
}

function setCookie(res: Response, req: Request, name: string, value: string, maxAge: number) {
  res.cookie(name, value, cookieOptions(req, maxAge));
}

function frontendRedirect() {
  return process.env.EXPO_WEB_PREVIEW_URL || process.env.EXPO_PACKAGER_PROXY_URL || "http://localhost:8081";
}

function safeReturnPath(value: unknown) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export function getEntraAccessToken(req: Request) {
  const cookies = parseCookie(req.headers.cookie ?? "");
  return cookies[TOKEN_COOKIE] || null;
}

export function registerEntraRoutes(app: Express) {
  app.get("/api/entra/login", (req, res) => {
    const state = randomBytes(32).toString("hex");
    const returnPath = safeReturnPath(req.query.returnPath);
    const stateValue = `${state}.${Buffer.from(returnPath).toString("base64url")}`;
    setCookie(res, req, STATE_COOKIE, stateValue, 10 * 60 * 1000);

    const authorizeUrl = new URL(`${AUTHORITY}/authorize`);
    authorizeUrl.searchParams.set("client_id", CLIENT_ID);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("redirect_uri", CALLBACK_URL);
    authorizeUrl.searchParams.set("response_mode", "query");
    authorizeUrl.searchParams.set("scope", TOKEN_SCOPE);
    authorizeUrl.searchParams.set("state", stateValue);
    authorizeUrl.searchParams.set("prompt", "select_account");
    res.redirect(authorizeUrl.toString());
  });

  app.get("/api/entra/callback", async (req, res) => {
    const code = typeof req.query.code === "string" ? req.query.code : null;
    const receivedState = typeof req.query.state === "string" ? req.query.state : null;
    const cookies = parseCookie(req.headers.cookie ?? "");
    const expectedState = cookies[STATE_COOKIE] ?? null;

    if (!code || !receivedState || !expectedState || receivedState !== expectedState) {
      res.status(400).send("Entra login state is invalid or expired.");
      return;
    }

    const returnPath = (() => {
      try {
        const encoded = receivedState.split(".")[1] ?? "";
        return safeReturnPath(Buffer.from(encoded, "base64url").toString("utf8"));
      } catch {
        return "/";
      }
    })();

    const clientSecret = process.env.AZURE_ENTRA_CLIENT_SECRET;
    if (!clientSecret) {
      res.status(503).send("Entra client secret is not configured on the server.");
      return;
    }

    try {
      const tokenResponse = await fetch(`${AUTHORITY}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: clientSecret,
          code,
          redirect_uri: CALLBACK_URL,
          grant_type: "authorization_code",
          scope: TOKEN_SCOPE,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      const payload = await tokenResponse.json() as { access_token?: string; expires_in?: number; error_description?: string };
      if (!tokenResponse.ok || !payload.access_token) {
        console.error("[entra] token exchange failed", { status: tokenResponse.status, detail: payload.error_description });
        res.status(502).send("Microsoft Entra token exchange failed.");
        return;
      }

      const maxAge = Math.max(60_000, Math.min((payload.expires_in ?? 3600) * 1000, 60 * 60 * 1000));
      res.clearCookie(STATE_COOKIE, cookieOptions(req, 0));
      setCookie(res, req, TOKEN_COOKIE, payload.access_token, maxAge);
      res.redirect(`${frontendRedirect()}${returnPath}`);
    } catch (error) {
      console.error("[entra] callback failed", { message: error instanceof Error ? error.message : "unknown" });
      res.status(502).send("Microsoft Entra login failed.");
    }
  });

  app.get("/api/entra/status", (req, res) => {
    res.json({ connected: Boolean(getEntraAccessToken(req)) });
  });

  app.post("/api/entra/logout", (req, res) => {
    res.clearCookie(TOKEN_COOKIE, cookieOptions(req, 0));
    res.json({ success: true });
  });
}
