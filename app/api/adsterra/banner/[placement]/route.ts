import { AD_UNITS, PRODUCTION_HOSTNAME, SITE_SCRIPTS } from '@/lib/site-scripts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ placement: string }> }) {
  const { placement } = await params;
  // Reverse proxies may use an internal request URL; keep the public host.
  const publicHost = request.headers.get('x-forwarded-host')?.split(',')[0].trim()
    || request.headers.get('host') || new URL(request.url).host;
  let hostname: string;
  try { hostname = new URL(`https://${publicHost}`).hostname; }
  catch { return new Response(null, { status: 404 }); }
  if (process.env.NODE_ENV !== 'production' || hostname !== PRODUCTION_HOSTNAME
      || !Object.prototype.hasOwnProperty.call(AD_UNITS, placement)) {
    return new Response(null, { status: 404 });
  }
  if (!SITE_SCRIPTS.adsterra) return new Response(null, { status: 404 });

  const unit = AD_UNITS[placement as keyof typeof AD_UNITS];
  // A real same-origin URL preserves the publisher hostname, referrer and
  // storage semantics for the synchronous provider embed.
  // Each document still owns its atOptions and parser-inserted scripts.
  const options = JSON.stringify({ key: unit.key, format: 'iframe', height: unit.height, width: unit.width, params: {} });
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script data-cfasync="false">atOptions=${options};</script><script data-cfasync="false" src="https://bauval.org/22/${unit.key}" onerror="console.error('Adsterra banner script failed to load:', this.src)"></script></body></html>`;
  return new Response(html, { headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Robots-Tag': 'noindex, nofollow',
  } });
}
