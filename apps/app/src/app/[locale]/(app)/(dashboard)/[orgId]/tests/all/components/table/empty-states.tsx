"use client";

import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import { CloudOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { refreshTestsAction } from "@/app/[locale]/(app)/(dashboard)/[orgId]/tests/all/actions/refreshTests";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

export function NoTests() {
	const t = useI18n();

  const refreshTests = useAction(refreshTestsAction, {
    onSuccess: () => {
      toast.success(t("tests.actions.refresh_success"));
      window.location.reload();
    },
    onError: () => {
      toast.error(t("tests.actions.refresh_error"));
    },
  });

  const refreshTestsClick = () => {
    refreshTests.execute();
  };

	return (
		<div className="mt-24 absolute w-full top-0 left-0 flex items-center justify-center z-20">
			<div className="text-center max-w-sm mx-auto flex flex-col items-center justify-center">
				<CloudOff className="mb-4 h-12 w-12 text-muted-foreground" />
				<h2 className="text-xl font-medium mb-2">
					{t("tests.empty.no_tests.title")}
				</h2>
				<p className="text-sm text-muted-foreground mb-6">
					{t("tests.empty.no_tests.description")}
				</p>
				<Button variant="action" onClick={refreshTestsClick}>{t("tests.actions.refresh")}</Button>
			</div>
		</div>
	);
}

export function NoResults({ hasFilters }: { hasFilters: boolean }) {
	const router = useRouter();
	const t = useI18n();
	const { orgId } = useParams<{ orgId: string }>();

	return (
		<div className="mt-24 flex items-center justify-center">
			<div className="flex flex-col items-center">
				<CloudOff className="mb-4 h-12 w-12 text-muted-foreground" />
				<div className="text-center mb-6 space-y-2">
					<h2 className="font-medium text-lg">
						{t("tests.empty.no_results.title")}
					</h2>
					<p className="text-muted-foreground text-sm">
						{hasFilters
							? t("tests.empty.no_results.description_with_filters")
							: t("tests.empty.no_results.description")}
					</p>
				</div>

				{hasFilters && (
					<Button
						variant="outline"
						onClick={() => router.push(`${orgId}/tests`)}
					>
						{t("tests.actions.clear")}
					</Button>
				)}
			</div>
		</div>
	);
}
