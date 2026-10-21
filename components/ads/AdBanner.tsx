'use client';

import { useMediaQuery, useProductionSite } from '@/hooks/use-site-runtime';
import { AD_UNITS, DESKTOP_AD_QUERY } from '@/lib/site-scripts';

export function AdBanner({ placement, label }: { placement: keyof typeof AD_UNITS; label: string }) {
  const production = useProductionSite();
  const desktop = useMediaQuery(DESKTOP_AD_QUERY);
  if (!desktop) return null;
  const unit = AD_UNITS[placement];
  // Preserve the supplied parser-inserted embed in its own document so multiple
  // atOptions globals/document.write calls cannot interfere with each other.
  const srcDoc = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden}</style></head><body><script>atOptions=${JSON.stringify({ key: unit.key, format: 'iframe', height: unit.height, width: unit.width, params: {} })};</script><script src="https://bauval.org/22/${unit.key}"></script></body></html>`;
  return <div data-ad-placement={placement} className="space-y-1.5" style={{ width: unit.width }}>
    <p className="text-center text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    {production ? (
      <iframe title={`${label} ${unit.width}×${unit.height}`} width={unit.width} height={unit.height} srcDoc={srcDoc} sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms" referrerPolicy="strict-origin-when-cross-origin" className="block border-0" />
    ) : (
      <div data-ad-placeholder className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted text-muted-foreground" style={{ width: unit.width, height: unit.height }}>
        <span className="text-xs">{label}</span><span className="font-mono text-xs">{unit.width} × {unit.height}</span>
      </div>
    )}
  </div>;
}
