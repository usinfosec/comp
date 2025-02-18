import { OtpSignIn } from "@/app/components/otp";
import { getI18n } from "@/app/locales/server";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login | Comp AI",
};

export default async function Page() {
  const t = await getI18n();

  const defaultSignInOptions = (
    <div className="flex flex-col space-y-2">
      <OtpSignIn />
    </div>
  );

  return (
    <>
      <div className="flex min-h-[calc(100vh-15rem)] items-center justify-center overflow-hidden p-6 md:p-0">
        <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
          <div className="relative flex w-full flex-col">
            <div className="inline-block from-primary bg-clip-text pb-4">
              <div className="flex flex-row items-center gap-2">
                <Link href="/" className="flex flex-row items-center gap-2">
                  <h1 className="font-mono text-xl font-semibold">Comp AI</h1>
                </Link>
              </div>
              <h2 className="mt-4 text-lg font-medium">{t("auth.title")}</h2>
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">
                  {t("auth.description")}
                </span>
              </div>
            </div>

            <div className="pointer-events-auto mb-6 flex flex-col">
              {defaultSignInOptions}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
