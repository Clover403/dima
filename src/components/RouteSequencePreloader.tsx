import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sequenceCache } from '../lib/sequenceCache';
import { nosotrosSequenceFrames, modelSequenceFrames } from '../lib/sequences';

export default function RouteSequencePreloader() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    // 1. Model page: ONLY when user navigates to /modelo-crediticio
    if (pathname === '/modelo-crediticio') {
      sequenceCache.preloadSequence(modelSequenceFrames, 6);
      return;
    }

    // 2. If user is on pages OTHER than home ('/') and model ('/modelo-crediticio')
    if (pathname !== '/' && pathname !== '/modelo-crediticio') {
      const startBackgroundNosotrosPreload = () => {
        // Delay slightly or use requestIdleCallback to prioritize active page content first
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            sequenceCache.preloadSequence(nosotrosSequenceFrames, 6);
          }, { timeout: 3000 });
        } else {
          setTimeout(() => {
            sequenceCache.preloadSequence(nosotrosSequenceFrames, 6);
          }, 1000);
        }
      };

      if (document.readyState === 'complete') {
        startBackgroundNosotrosPreload();
      } else {
        window.addEventListener('load', startBackgroundNosotrosPreload, { once: true });
        return () => window.removeEventListener('load', startBackgroundNosotrosPreload);
      }
    }
  }, [location.pathname]);

  return null;
}
