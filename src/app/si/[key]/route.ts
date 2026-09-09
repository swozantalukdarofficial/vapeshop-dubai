import { NextResponse } from "next/server";

import { resolveStaticImage } from "@/lib/images/static-catalog";
import { DEFAULT_WIDTH, serveProxiedImageUrl } from "@/lib/images/serve";

/** Width-less variant, for consumers not going through the `next/image` loader. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const sourceUrl = resolveStaticImage(key);
  if (!sourceUrl) return new NextResponse("Not found", { status: 404 });
  return serveProxiedImageUrl(sourceUrl, DEFAULT_WIDTH);
}
