"use client";

import { ButtonIcon } from "@/components/ui/button-icon";
import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import { Icons } from "@bubba/ui/icons";
import { Loader2 } from "lucide-react";
import { authClient } from "@bubba/auth";
import { useState } from "react";
import router from "next/router";

export function GoogleSignIn({
  inviteCode,
}: {
  inviteCode?: string;
}) {
  const t = useI18n();
  const [isLoading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    const redirectTo = inviteCode
      ? `/api/auth/invitation?code=${inviteCode}`
      : "/";

    await authClient.signIn.social({
      provider: "google",
    }).then((res) => {
      if (res.error) {
        console.error(res.error);
      } else {
        router.push(redirectTo);
      }
    });
  };

  return (
    <Button
      onClick={handleSignIn}
      className="flex h-[40px] w-full space-x-2 px-6 py-4 font-medium active:scale-[0.98]"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <ButtonIcon className="mr-2" isLoading={isLoading}>
            <Icons.Google />
          </ButtonIcon>
          <span>{t("auth.google")}</span>
        </>
      )}
    </Button>
  );
}
