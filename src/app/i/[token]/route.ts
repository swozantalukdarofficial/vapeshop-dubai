import { DEFAULT_WIDTH, serveProxiedImage } from "@/lib/images/serve";

/**
 * Width-less variant, for consumers that use a sealed URL directly rather than going
 * through `next/image` — a raw `<img src="/i/...">`, an OG tag, or JSON-LD. Without
 * this, those would 404 and the image would silently break.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  return serveProxiedImage(token, DEFAULT_WIDTH);
}
