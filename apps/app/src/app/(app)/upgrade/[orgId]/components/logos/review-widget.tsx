'use client';

import { useEffect, useState, useRef, Suspense } from 'react';

interface SenjaReviewWidgetProps {
  widgetId: string;
  mode?: 'shadow' | 'inline' | 'popup';
  lazyLoad?: boolean;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Global script loading state
const scriptLoadingState = {
  loading: false,
  loaded: false,
  error: null as Error | null,
  promises: [] as Array<{ resolve: () => void; reject: (error: Error) => void }>
};

function loadSenjaScript(widgetId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (scriptLoadingState.loaded) {
      resolve();
      return;
    }

    // If there's an error, reject
    if (scriptLoadingState.error) {
      reject(scriptLoadingState.error);
      return;
    }

    // If already loading, add to promises queue
    if (scriptLoadingState.loading) {
      scriptLoadingState.promises.push({ resolve, reject });
      return;
    }

    // Start loading
    scriptLoadingState.loading = true;
    scriptLoadingState.promises.push({ resolve, reject });

    // Check if script is already in DOM
    const existingScript = document.querySelector(`script[src*="widget.senja.io"]`);

    if (existingScript) {
      scriptLoadingState.loaded = true;
      scriptLoadingState.loading = false;
      scriptLoadingState.promises.forEach(({ resolve }) => resolve());
      scriptLoadingState.promises = [];
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://widget.senja.io/widget/${widgetId}/platform.js`;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      scriptLoadingState.loaded = true;
      scriptLoadingState.loading = false;
      scriptLoadingState.promises.forEach(({ resolve }) => resolve());
      scriptLoadingState.promises = [];
    };

    script.onerror = (error) => {
      const scriptError = new Error(`Failed to load Senja widget script: ${error}`);
      scriptLoadingState.error = scriptError;
      scriptLoadingState.loading = false;
      scriptLoadingState.promises.forEach(({ reject }) => reject(scriptError));
      scriptLoadingState.promises = [];
    };

    document.head.appendChild(script);
  });
}

function SenjaReviewWidgetContent({
  widgetId,
  mode = 'shadow',
  lazyLoad = false,
  className = '',
  style = {},
  onLoad,
  onError
}: SenjaReviewWidgetProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    const loadWidget = async () => {
      try {
        await loadSenjaScript(widgetId);

        if (isMountedRef.current) {
          setIsLoaded(true);
          onLoad?.();
        }
      } catch (err) {
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error('Failed to load Senja widget');
          setError(error);
          onError?.(error);
        }
      }
    };

    // Use Intersection Observer for lazy loading if enabled
    if (lazyLoad && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadWidget();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      loadWidget();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [widgetId, lazyLoad, onLoad, onError]);

  // Show error state
  if (error) {
    return (
      <div className={`senja-error ${className}`} style={style}>
        <div className="text-red-500 text-sm p-4 border border-red-200 rounded-lg">
          Failed to load review widget: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`senja-embed ${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
      data-id={widgetId}
      data-mode={mode}
      data-lazyload={lazyLoad.toString()}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '80px',
        transition: 'opacity 0.3s ease-in-out',
        ...style
      }}
    />
  );
}

export default function SenjaReviewWidget({
  fallback = <div className="h-20 bg-transparent" />,
  ...props
}: SenjaReviewWidgetProps) {
  return (
    <Suspense fallback={fallback}>
      <SenjaReviewWidgetContent {...props} />
    </Suspense>
  );
}