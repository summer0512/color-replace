'use client';

import { useMediaQuery, useProductionSite } from '@/hooks/use-site-runtime';
import { AD_UNITS, DESKTOP_AD_QUERY } from '@/lib/site-scripts';

export function AdBanner({ placement, label }: { placement: keyof typeof AD_UNITS; label: string }) {
  const production = useProductionSite();
  const desktop = useMediaQuery(DESKTOP_AD_QUERY);
  if (!desktop) return null;
  const unit = AD_UNITS[placement];
  return <div data-ad-placement={placement} className="space-y-1.5" style={{ width: unit.width }}>
    <p className="text-center text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    {production ? (
      <iframe title={`${label} ${unit.width}×${unit.height}`} width={unit.width} height={unit.height} src={`/api/adsterra/banner/${placement}`} referrerPolicy="strict-origin-when-cross-origin" className="block border-0" />
    ) : (
      <div data-ad-placeholder className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted text-muted-foreground" style={{ width: unit.width, height: unit.height }}>
        <span className="text-xs">{label}</span><span className="font-mono text-xs">{unit.width} × {unit.height}</span>
      </div>
    )}
  </div>;
}
