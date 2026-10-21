export const PRODUCTION_HOSTNAME = 'color-replace.com';

// Independent switches: Adsterra can be disabled without affecting Google.
export const SITE_SCRIPTS = {
  googleAnalytics: true,
  googleAds: true,
  adsterra: true,
};

export const DESKTOP_AD_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
// The existing content container is 1080px wide. Keep room for both rails.
export const SIDE_AD_QUERY = '(min-width: 1536px) and (min-height: 760px) and (hover: hover) and (pointer: fine)';
export const DOWNLOAD_AD_COOLDOWN_MS = 30 * 60_000;
export const DOWNLOAD_AD_STORAGE_KEY = 'color-replace.last-download-ad.v1';

export function isProductionSite(environment: string | undefined, hostname: string) {
  return environment === 'production' && hostname === PRODUCTION_HOSTNAME;
}

export const AD_UNITS = {
  left: { key: '6b49ab5ab2a3b675d8d88df0db98fc1c', width: 160, height: 600 },
  right: { key: '0b0625a6cda43d614017c32d499b98e6', width: 160, height: 300 },
  download: { key: 'd65a713697e4e2c99cff5c3223cafbc7', width: 300, height: 250 },
} as const;
