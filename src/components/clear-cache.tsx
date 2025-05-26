'use client';

import { useEffect } from 'react';

const ClearCache = () => {
  const clearAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();

      sessionStorage.clear();

      document.cookie.split(';').forEach((cookie) => {
        const [key] = cookie.split('=');
        document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      });

      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
        });
      }
    }
  };

  useEffect(() => {
    clearAllData();
  }, []);

  return null;
};

export default ClearCache;
