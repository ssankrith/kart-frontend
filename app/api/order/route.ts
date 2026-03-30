import { NextResponse } from "next/server";
import type { OrderReq } from "@/lib/types";

function getBaseUrl(): string {
  const url = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!url) {
    throw new Error("API_BASE_URL is not configured");
  }
  return url;
}

function getApiKey(): string {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("API_KEY is not configured");
  }
  return key;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "bad_request", message: "Invalid JSON" },
      { status: 400 }
    );
  }

  const req = body as OrderReq;
  if (
    !req.items ||
    !Array.isArray(req.items) ||
    req.items.length === 0
  ) {
    return NextResponse.json(
      { code: "validation", message: "At least one item is required" },
      { status: 422 }
    );
  }

  for (const line of req.items) {
    if (
      !line ||
      typeof line.productId !== "string" ||
      typeof line.quantity !== "number" ||
      line.quantity < 1
    ) {
      return NextResponse.json(
        { code: "bad_request", message: "Invalid line item" },
        { status: 400 }
      );
    }
  }

  let baseUrl: string;
  let apiKey: string;
  try {
    baseUrl = getBaseUrl();
    apiKey = getApiKey();
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { code: "internal", message: "Server configuration error" },
      { status: 500 }
    );
  }

  const payload: OrderReq = {
    items: req.items.map((l) => ({
      productId: l.productId,
      quantity: l.quantity,
    })),
    ...(req.couponCode != null && req.couponCode !== ""
      ? { couponCode: req.couponCode }
      : {}),
  };

  const res = await fetch(`${baseUrl}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_key: apiKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json(
      { code: "internal", message: "Invalid response from API" },
      { status: 502 }
    );
  }

  if (!res.ok) {
    const err = data as { message?: string; code?: string };
    return NextResponse.json(
      {
        code: err.code ?? "error",
        message: err.message ?? `Order failed (${res.status})`,
      },
      { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
