import { parseWidth, serveProxiedImage } from "@/lib/images/serve";

/**
 * Serves remote product imagery from our own origin so `cdn.shopify.com` never appears
 * as a resource host. Widths come from the `next/image` loader.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string; width: string }> }
) {
  const { token, width } = await params;
  return serveProxiedImage(token, parseWidth(width));
}
