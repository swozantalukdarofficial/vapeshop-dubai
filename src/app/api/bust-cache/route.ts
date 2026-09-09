import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getSession } from "@/lib/auth/session";

/**
 * Flushing the layout cache makes every subsequent request an origin miss, so this
 * has to be authenticated — left open it's a free way to thrash the cache.
 *
 * POST rather than GET: a state-changing GET can be fired by a link prefetcher,
 * a crawler, or an <img> tag.
 */

function hasValidSecret(request: NextRequest): boolean {
  const expected = process.env.CACHE_BUST_SECRET;
  if (!expected) return false;

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch, so compare lengths first.
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session && !hasValidSecret(request)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, message: "Cache busted." });
}
