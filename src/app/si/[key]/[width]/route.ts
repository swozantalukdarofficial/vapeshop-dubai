import { NextResponse } from "next/server";

import { resolveStaticImage } from "@/lib/images/static-catalog";
import { parseWidth, serveProxiedImageUrl } from "@/lib/images/serve";

/**
 * Static decorative imagery, addressed by alias rather than by sealed token so that
 * client components can reference it without embedding the real CDN URL.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string; width: string }> }
) {
  const { key, width } = await params;
  const sourceUrl = resolveStaticImage(key);
  if (!sourceUrl) return new NextResponse("Not found", { status: 404 });
  return serveProxiedImageUrl(sourceUrl, parseWidth(width));
}
