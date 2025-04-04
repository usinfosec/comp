"use client";

import { deleteOrganizationAction } from "@/actions/organization/delete-organization-action";
import { useI18n } from "@/locales/client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@comp/ui/alert-dialog";
import { Button } from "@comp/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { Label } from "@comp/ui/label";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteOrganization({
	organizationId,
}: {
	organizationId: string;
}) {
	const t = useI18n();
	const [value, setValue] = useState("");
	const deleteOrganization = useAction(deleteOrganizationAction, {
		onSuccess: () => {
			toast.success(t("settings.general.org_delete_success"));
			redirect("/");
		},
		onError: () => {
			toast.error(t("settings.general.org_delete_error"));
		},
	});

	return (
		<Card className="border border-destructive/50">
			<CardHeader className="pb-2">
				<div className="flex items-center gap-2">
					<AlertTriangle className="h-4 w-4 text-destructive" />
					<CardTitle>{t("settings.general.org_delete")}</CardTitle>
				</div>
				<CardDescription className="mt-1">
					{t("settings.general.org_delete_description")}
				</CardDescription>
			</CardHeader>
			<CardContent className="pb-4">
				<p className="text-sm text-muted-foreground mb-2">
					{t("settings.general.org_delete_warning")}
				</p>
			</CardContent>
			<CardFooter className="py-3 flex justify-between bg-muted/30 border-t text-xs text-muted-foreground">
				<div className="text-destructive/80">
					{t("settings.general.org_delete_permanent")}
				</div>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="destructive"
							size="sm"
							className="hover:bg-destructive/90"
						>
							{t("common.actions.delete")}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("settings.general.org_delete_alert_title")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t("settings.general.org_delete_alert_description")}
							</AlertDialogDescription>
						</AlertDialogHeader>

						<div className="mt-2 flex flex-col gap-2">
							<Label htmlFor="confirm-delete">
								{t("settings.general.delete_confirm_tip")}
							</Label>
							<Input
								id="confirm-delete"
								value={value}
								onChange={(e) => setValue(e.target.value)}
							/>
						</div>

						<AlertDialogFooter className="mt-4">
							<AlertDialogCancel>
								{t("common.actions.cancel")}
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={() =>
									deleteOrganization.execute({
										id: organizationId,
										organizationId,
									})
								}
								disabled={value !== t("settings.general.delete_confirm")}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								{deleteOrganization.status === "executing" ? (
									<Loader2 className="h-4 w-4 animate-spin mr-1" />
								) : null}
								{t("common.actions.delete")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardFooter>
		</Card>
	);
}
