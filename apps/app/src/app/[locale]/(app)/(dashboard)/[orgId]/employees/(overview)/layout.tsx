import { auth } from "@bubba/auth";
import { AppOnboarding } from "@/components/app-onboarding";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";
import { cache, Suspense } from "react";
import { EmployeeInviteSheet } from "@/components/sheets/add-employee-sheet";
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

  const overview = await getEmployeesOverview();

  if (overview.length === 0) {
    return (
      <div className="max-w-[1200px] m-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="mt-8">
            <AppOnboarding
              title={t("app_onboarding.employees.title")}
              description={t("app_onboarding.employees.description")}
              cta={t("app_onboarding.employees.cta")}
              imageSrc="/onboarding/people-management.webp"
              imageAlt="Employee Management"
              sheetName="invite-user-sheet"
              faqs={[
                {
                  questionKey: t("app_onboarding.employees.faqs.question_1"),
                  answerKey: t("app_onboarding.employees.faqs.answer_1"),
                },
                {
                  questionKey: t("app_onboarding.employees.faqs.question_2"),
                  answerKey: t("app_onboarding.employees.faqs.answer_2"),
                },
                {
                  questionKey: t("app_onboarding.employees.faqs.question_3"),
                  answerKey: t("app_onboarding.employees.faqs.answer_3"),
                },
              ]}
            />
            <EmployeeInviteSheet />
          </div>
        </Suspense>
      </div>
    );
  }


  return (
    <div className="max-w-[1200px] m-auto">
      <SecondaryMenu
        items={[
          {
            path: `/${orgId}/employees`,
            label: t("people.dashboard.title"),
          },
          { path: `/${orgId}/employees/all`, label: t("people.all") },
        ]}
      />

      <main className="mt-8">{children}</main>
    </div>
  );
}

const getEmployeesOverview = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const orgId = session?.user.organizationId;

  const employees = await db.employee.findMany({
    where: {
      organizationId: orgId,
    },
  });

  return employees;
});
