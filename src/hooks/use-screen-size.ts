// Hook to detect screen size
import { useEffect, useState } from 'react';

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function useScreenSize(): ScreenSize {
  // Default to 'md' to prevent hydration mismatch
  const [screenSize, setScreenSize] = useState<ScreenSize>('md');

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      const updateScreenSize = () => {
        const width = window.innerWidth;
        
        if (width < 640) return setScreenSize('xs');
        if (width < 768) return setScreenSize('sm');
        if (width < 1024) return setScreenSize('md');
        if (width < 1280) return setScreenSize('lg');
        return setScreenSize('xl');
      };

      // Set initial size
      updateScreenSize();

      // Add event listener
      window.addEventListener('resize', updateScreenSize);

      // Cleanup
      return () => window.removeEventListener('resize', updateScreenSize);
    }
  }, []);

  return screenSize;
}
