'use client';

import { useEffect } from 'react';

interface SenjaReviewWidgetProps {
  widgetId: string;
  mode?: 'shadow' | 'inline' | 'popup';
  lazyLoad?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function SenjaReviewWidget({
  widgetId,
  mode = 'shadow',
  lazyLoad = false,
  className = '',
  style = {},
}: SenjaReviewWidgetProps) {
  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src*="widget.senja.io"]`);

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://widget.senja.io/widget/${widgetId}/platform.js`;
      script.type = 'text/javascript';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [widgetId]);

  return (
    <div
      className={`senja-embed ${className}`}
      data-id={widgetId}
      data-mode={mode}
      data-lazyload={lazyLoad.toString()}
      style={{
        display: 'block',
        width: '100%',
        ...style,
      }}
    />
  );
}
