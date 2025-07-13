import { useState, useEffect } from 'react';

type ImageStatus = 'loading' | 'success' | 'error';

/**
 * Custom hook to track image loading status
 * @param src The image URL to load
 * @returns Object with status and error
 */
export function useImageLoader(src: string | null) {
  const [status, setStatus] = useState<ImageStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setStatus('error');
      setError('No image source provided');
      return;
    }

    console.log(`[Image Loader] Loading image: ${src}`);
    
    const img = new Image();
    img.onload = () => {
      console.log(`[Image Loader] Success loading: ${src}`);
      setStatus('success');
      setError(null);
    };
    
    img.onerror = (e) => {
      const errorMsg = `Failed to load image: ${src}`;
      console.error(`[Image Loader] ${errorMsg}`, e);
      setStatus('error');
      setError(errorMsg);
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { status, error };
}
