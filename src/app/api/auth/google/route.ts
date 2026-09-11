import { NextRequest, NextResponse } from "next/server";

// Generates the Google OAuth consent URL and redirects the user
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/auth/login?error=google_not_configured", request.url));
  }

  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();
  const state = crypto.randomUUID();
  const next = request.nextUrl.searchParams.get("next") || "/";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: JSON.stringify({ s: state, next }),
    prompt: "select_account",
  });

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const res = NextResponse.redirect(googleUrl);
  // double-submit cookie: state goes in cookie + query param
  res.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
