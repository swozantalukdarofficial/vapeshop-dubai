import { promises as dns } from "node:dns";

/**
 * Confirms a request really is the search crawler its User-Agent claims to be.
 *
 * This is the piece that protects organic traffic: any bot mitigation must let Googlebot
 * through, and a User-Agent string alone is worthless because scrapers set it freely.
 * So we do the check Google documents — reverse-DNS the client IP, confirm the hostname
 * belongs to the crawler's domain, then forward-resolve that hostname back to the same
 * IP (the reverse record alone is attacker-controllable).
 */

/** Domains that own each crawler's address space. */
const CRAWLER_DOMAINS = [
  ".googlebot.com",
  ".google.com",
  ".search.msn.com",
  ".crawl.yahoo.net",
  ".applebot.apple.com",
  ".duckduckgo.com",
] as const;

const CRAWLER_UA = /googlebot|bingbot|slurp|duckduckbot|applebot|google-inspectiontool/i;

/** Cheap pre-filter: no DNS work unless the UA even claims to be a crawler. */
export function claimsToBeCrawler(userAgent: string | null): boolean {
  return Boolean(userAgent && CRAWLER_UA.test(userAgent));
}

export async function isVerifiedCrawler(
  ip: string | null,
  userAgent: string | null
): Promise<boolean> {
  if (!ip || !claimsToBeCrawler(userAgent)) return false;

  try {
    const hostnames = await dns.reverse(ip);
    const match = hostnames.find((hostname) =>
      CRAWLER_DOMAINS.some((domain) => hostname.toLowerCase().endsWith(domain))
    );
    if (!match) return false;

    // Forward-confirm: a PTR record can be set by whoever owns the IP block, so it
    // proves nothing on its own.
    const resolved = await dns.resolve(match).catch(() => [] as string[]);
    return resolved.includes(ip);
  } catch {
    return false;
  }
}

/** Client IP as seen through Vercel's proxy. */
export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip");
}
