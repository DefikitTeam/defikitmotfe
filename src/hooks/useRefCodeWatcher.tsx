import { useEffect, useState } from 'react';

// Fallback in-memory storage if nothing else is available
const memoryStorage = new Map<string, string>();

function useRefCodeWatcher(storageKey: string) {
  // Helper to get the best available storage method
  const getStorage = () => {
    try {
      if (typeof window !== 'undefined') {
        if (window.localStorage) return window.localStorage;
        if (window.sessionStorage) return window.sessionStorage;
      }
    } catch (e) {
      // If both localStorage and sessionStorage fail
      console.warn('Browser storage is not available, using in-memory storage');
    }
    return {
      getItem: (key: string) => memoryStorage.get(key) || null,
      setItem: (key: string, value: string) => memoryStorage.set(key, value),
      removeItem: (key: string) => memoryStorage.delete(key)
    };
  };

  const storage = getStorage();

  const getInitialValue = () => {
    try {
      return storage.getItem(storageKey);
    } catch (e) {
      return null;
    }
  };

  const [refCodeExisted, setRefCodeExisted] = useState(getInitialValue());

  // Helper to safely set storage
  const setStorage = (value: string | null) => {
    try {
      if (value === null) {
        storage.removeItem(storageKey);
      } else {
        storage.setItem(storageKey, value);
      }
      setRefCodeExisted(value);
    } catch (e) {
      console.warn('Failed to set storage:', e);
      setRefCodeExisted(null);
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey) {
        setRefCodeExisted(event.newValue);
      }
    };

    // Only add listener if we're using browser storage
    if (
      typeof window !== 'undefined' &&
      (window.localStorage || window.sessionStorage)
    ) {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [storageKey]);

  return {
    value: refCodeExisted,
    setValue: setStorage
  };
}

export default useRefCodeWatcher;
