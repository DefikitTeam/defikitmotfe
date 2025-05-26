'use client';

import { initEruda } from '@/src/common/utils/debug';
import { useEffect } from 'react';

export default function ErudaInit() {
  useEffect(() => {
    initEruda();
  }, []);

  return null;
}
