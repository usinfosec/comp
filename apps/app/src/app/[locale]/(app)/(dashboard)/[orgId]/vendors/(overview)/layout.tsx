import { auth } from "@/auth/auth";
import { AppOnboarding } from "@/components/app-onboarding";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { cache, Suspense } from "react";
import { CreateVendorSheet } from "../components/create-vendor-sheet";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getI18n();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const orgId = user?.organizationId;

  const overview = await getVendorOverview();

  if (overview?.vendors === 0) {
    return (
      <div className="max-w-[1200px] m-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="mt-8">
            <AppOnboarding
              title={t("app_onboarding.vendors.title")}
              description={t("app_onboarding.vendors.description")}
              cta={t("app_onboarding.vendors.cta")}
              imageSrc="/onboarding/vendor-management.webp"
              imageAlt="Vendor Management"
              sheetName="createVendorSheet"
              faqs={[
                {
                  questionKey: t("app_onboarding.vendors.faqs.question_1"),
                  answerKey: t("app_onboarding.vendors.faqs.answer_1"),
                },
                {
                  questionKey: t("app_onboarding.vendors.faqs.question_2"),
                  answerKey: t("app_onboarding.vendors.faqs.answer_2"),
                },
                {
                  questionKey: t("app_onboarding.vendors.faqs.question_3"),
                  answerKey: t("app_onboarding.vendors.faqs.answer_3"),
                },
                {
                  questionKey: t("app_onboarding.vendors.faqs.question_4"),
                  answerKey: t("app_onboarding.vendors.faqs.answer_4"),
                },
              ]}
            />
            <CreateVendorSheet />
          </div>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] m-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <SecondaryMenu
          items={[
            { path: `/${orgId}/vendors`, label: t("vendors.dashboard.title") },
            {
              path: `/${orgId}/vendors/register`,
              label: t("vendors.register.title"),
            },
          ]}
        />

        <main className="mt-8">{children}</main>
      </Suspense>
    </div>
  );
}

const getVendorOverview = cache(
  async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user.organizationId) {
      return { vendors: 0 };
    }

    return await db.$transaction(async (tx) => {
      const [vendors] = await Promise.all([
        tx.vendor.count({
          where: { organizationId: session.user.organizationId },
        }),
      ]);

      return {
        vendors,
      };
    });
  }
);
