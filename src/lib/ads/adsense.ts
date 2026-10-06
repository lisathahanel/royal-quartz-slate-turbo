export const ADSENSE_CLIENT = "ca-pub-2269884583846743";
export const ADSENSE_SLOT = "2906167922";
export const ADSENSE_SCRIPT = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function pushAdSense() {
  if (typeof window === "undefined") return;
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.push({});
}
