import { useEffect, useState } from 'react';

function useRefCodeWatcher(storageKey: string) {
    const [refCodeExisted, setRefCodeExisted] = useState(
        localStorage.getItem(storageKey)
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setRefCodeExisted(localStorage.getItem(storageKey));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [storageKey]);

    return refCodeExisted;
}

export default useRefCodeWatcher;
