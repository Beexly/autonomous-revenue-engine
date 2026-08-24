import { scoreDraft } from "../../../lib/score.js";

export const runtime = "nodejs";

/**
 * POST /api/score
 * Body: { text: string, platform?: "x" }
 * Free tier: no auth yet. Rate limit later via edge/IP.
 * x402/Stripe rails attach here later without changing scorer.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const text = body?.text;
  const platform = body?.platform || "x";
  const result = scoreDraft(text, { platform });
  if (result.error) {
    return Response.json(result, { status: 400 });
  }
  return Response.json(result, {
    headers: {
      "Cache-Control": "no-store",
      "X-QI-Check-Version": result.version,
    },
  });
}

export async function GET() {
  return Response.json({
    service: "qi-check",
    version: "0.1.0",
    usage: "POST { text, platform? }",
    payments: {
      free: true,
      stripe: "planned",
      x402: "planned — Base Sepolia then Base",
    },
  });
}
