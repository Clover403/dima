export function isIOS(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isSafariOrIOS(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent;
  const ios = isIOS();

  // Detect Safari (Vendor contains Apple or userAgent contains Safari, but not Chrome/CriOS/FxiOS/Edg/Android)
  const isSafari =
    /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|Edg|Android/.test(ua);

  return ios || isSafari;
}
