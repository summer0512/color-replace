'use client';

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-site-runtime';
import { getAdCopy } from '@/i18n/ads';
import { languages } from '@/i18n/config';
import { DESKTOP_AD_QUERY, SIDE_AD_QUERY, SITE_SCRIPTS } from '@/lib/site-scripts';
import { AdBanner } from './AdBanner';

const DownloadAdContext = createContext<() => void>(() => {});
export const useDownloadAd = () => useContext(DownloadAdContext);

function isToolPage(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (languages.some(({ value }) => value === parts[0])) parts.shift();
  return parts.length === 0;
}

function DownloadAdDialog({ onClose }: { onClose: () => void }) {
  const copy = getAdCopy(useLocale());
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const hintId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    // Strict Mode replays this cleanup in development. A native close event
    // from cleanup must not dismiss the subsequently reopened dialog.
    return () => dialog?.close();
  }, []);
  return <dialog ref={dialogRef} aria-labelledby={titleId} aria-describedby={hintId} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="fixed m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border bg-background p-6 text-foreground shadow-xl backdrop:bg-black/50 print:hidden">
    <button type="button" onClick={onClose} aria-label={copy.continueEditing} className="absolute right-3 top-3 rounded p-1.5 text-muted-foreground hover:bg-muted"><X size={18} /></button>
    <CheckCircle2 className="mb-3 text-emerald-600" aria-hidden="true" />
    <h2 id={titleId} dir="auto" className="pr-6 text-lg font-semibold">{copy.title}</h2>
    <p id={hintId} dir="auto" className="mt-1 text-sm text-muted-foreground">{copy.hint}</p>
    <div className="my-5 flex justify-center"><AdBanner placement="download" label={copy.advertisement} /></div>
    <Button type="button" onClick={onClose} className="w-full">{copy.continueEditing}</Button>
  </dialog>;
}

export function SiteAds({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const copy = getAdCopy(useLocale());
  const desktop = useMediaQuery(DESKTOP_AD_QUERY);
  const wide = useMediaQuery(SIDE_AD_QUERY);
  const [downloadPath, setDownloadPath] = useState<string | null>(null);
  const onTool = isToolPage(pathname);
  useEffect(() => { setDownloadPath(null); }, [pathname, desktop]);
  const showDownloadAd = useCallback(() => {
    if (!SITE_SCRIPTS.adsterra || !window.matchMedia(DESKTOP_AD_QUERY).matches || !isToolPage(window.location.pathname)) return;
    if (document.querySelector('dialog[open], [role="dialog"], [role="alertdialog"]')) return;
    setDownloadPath(pathname);
  }, [pathname]);

  return <DownloadAdContext.Provider value={showDownloadAd}>
    {children}
    {SITE_SCRIPTS.adsterra && onTool && wide ? <>
      <aside aria-label={copy.advertisement} className="fixed left-[calc(50%-724px)] top-24 z-20 print:hidden"><AdBanner placement="left" label={copy.advertisement} /></aside>
      <aside aria-label={copy.advertisement} className="fixed right-[calc(50%-724px)] top-24 z-20 print:hidden"><AdBanner placement="right" label={copy.advertisement} /></aside>
    </> : null}
    {SITE_SCRIPTS.adsterra && desktop && onTool && downloadPath === pathname ? <DownloadAdDialog onClose={() => setDownloadPath(null)} /> : null}
  </DownloadAdContext.Provider>;
}
