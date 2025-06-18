'use client';

import { completeInvitation } from '@/actions/organization/accept-invitation';
import { Button } from '@comp/ui/button';
import { Icons } from '@comp/ui/icons';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function AcceptInvite({
  inviteCode,
  organizationName,
}: {
  inviteCode: string;
  organizationName: string;
}) {
  const router = useRouter();

  const { execute, isPending } = useAction(completeInvitation, {
    onSuccess: (result) => {
      if (result.data?.data?.organizationId) {
        router.push(`/${result.data.data.organizationId}/frameworks`);
      }
    },
    onError: (error) => {
      toast.error('Failed to accept invitation');
    },
  });

  const handleAccept = () => {
    execute({ inviteCode });
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 md:p-8">
      <div className="bg-card relative w-full max-w-[440px] rounded-sm border p-8 shadow-lg">
        <div className="mb-8 flex justify-between">
          <Link href="/">
            <Icons.Logo />
          </Link>
        </div>

        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            You have been invited to join {organizationName || 'an organization'}.
          </h1>
          <p className="text-muted-foreground text-sm">
            Please accept the invitation to join the organization.
          </p>
        </div>

        <Button onClick={handleAccept} className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Accepting...
            </>
          ) : (
            'Accept Invitation'
          )}
        </Button>
      </div>
    </div>
  );
}
