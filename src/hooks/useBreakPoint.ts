import { useEffect, useState } from 'react';
import { SCREEN_SM } from '../common/constant/constance';

export const useBreakPoint = (innerWidth?: number) => {
  const breakpointWidth = innerWidth || SCREEN_SM;
  const [isMatchingBreakPoint, setIsMatchingBreakPoint] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMatchingBreakPoint(window.innerWidth < breakpointWidth);
    };

    // Initial check
    if (typeof window !== 'undefined') {
      handleResize();

      // Throttle the resize event
      const throttledHandleResize = throttle(handleResize, 200);

      window.addEventListener('resize', throttledHandleResize);

      return () => {
        window.removeEventListener('resize', throttledHandleResize);
      };
    }
  }, [breakpointWidth]);

  return isMatchingBreakPoint;
};

// Throttle function to limit the frequency of a function call
const throttle = (func: () => void, delay: number) => {
  let lastCall = 0;
  return function () {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func();
    }
  };
};
