import { NextResponse } from "next/server";

function getBaseUrl(): string {
  const url = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!url) {
    throw new Error("API_BASE_URL is not configured");
  }
  return url;
}

function verifyCronAuth(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return true;
  }
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/**
 * Wake Render / keep the backend warm by hitting GET /product (same as browser catalog fetch).
 * Schedule via GitHub Actions (or any cron) against this URL; optional CRON_SECRET for auth.
 */
export async function GET(request: Request) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let baseUrl: string;
  try {
    baseUrl = getBaseUrl();
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "server_config" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${baseUrl}/product`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, upstreamStatus: res.status },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
