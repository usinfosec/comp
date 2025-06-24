'use client';

import { DubEmbed } from '@dub/embed-react';
import { useEffect, useState } from 'react';

export const DubReferral = () => {
  const [publicToken, setPublicToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicToken = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/dub/embed-token');

        if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.publicToken) {
          throw new Error('No public token received from server');
        }

        setPublicToken(data.publicToken);
      } catch (err) {
        console.error('Error fetching public token:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-full max-w-md rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center">
          <h3 className="mb-2 text-sm font-medium text-destructive">Oops, something went wrong</h3>
          <p className="text-xs text-destructive/80">{error}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            Please refresh the page and try again. If the problem persists,{' '}
            <a
              href="https://discord.gg/compai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  if (!publicToken) {
    return (
      <div className="rounded-md border border-muted bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          No token available. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return <DubEmbed data="referrals" token={publicToken} />;
};
