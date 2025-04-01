"use client";

import { inviteMember } from "@/actions/organization/invite-member";
import { Button } from "@bubba/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@bubba/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@bubba/ui/form";
import { Input } from "@bubba/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Role, Departments } from "@bubba/db/types";
import { z } from "zod";
import { useState } from "react";
import { useI18n } from "@/locales/client";

const inviteMemberSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	role: z.nativeEnum(Role, {
		errorMap: () => ({ message: "Please select a role" }),
	}),
	department: z.nativeEnum(Departments, {
		errorMap: () => ({ message: "Please select a department" }),
	}),
});

type FormValues = z.infer<typeof inviteMemberSchema>;

export function InviteMemberForm() {
	const t = useI18n();
	const [isSuccess, setIsSuccess] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(inviteMemberSchema),
		defaultValues: {
			email: "",
			role: Role.employee,
			department: Departments.none,
		},
	});

	const inviteMemberAction = useAction(inviteMember, {
		onSuccess: (response) => {
			if (response.data?.success) {
				setIsSuccess(true);
				const email = form.getValues().email;
				form.reset();
				toast.success(
					`${t("settings.team.invitations.toast.resend_success_prefix")} ${email}`,
				);

				setTimeout(() => setIsSuccess(false), 3000);
			} else {
				toast.error(t("settings.team.invite.toast.error"));
			}
		},
		onError: () => {
			toast.error(t("settings.team.invite.toast.unexpected"));
		},
	});

	const onSubmit = (data: FormValues) => {
		setIsSuccess(false);
		inviteMemberAction.execute(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>{t("settings.team.invite.title")}</CardTitle>
						<CardDescription>
							{t("settings.team.invite.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("settings.team.invite.form.email.label")}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(
												"settings.team.invite.form.email.placeholder",
											)}
											autoComplete="off"
											autoCapitalize="none"
											autoCorrect="off"
											spellCheck="false"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("settings.team.invite.form.role.label")}
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={t(
														"settings.team.invite.form.role.placeholder",
													)}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value={Role.employee}>
												{t("settings.team.members.role.member")}
											</SelectItem>
											<SelectItem value={Role.admin}>
												{t("settings.team.members.role.admin")}
											</SelectItem>
											<SelectItem value={Role.auditor}>
												{t("settings.team.members.role.auditor")}
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="department"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("settings.team.invite.form.department.label")}
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={t(
														"settings.team.invite.form.department.placeholder",
													)}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value={Departments.none}>
												{t("settings.team.invite.form.departments.none")}
											</SelectItem>
											<SelectItem value={Departments.it}>
												{t("settings.team.invite.form.departments.it")}
											</SelectItem>
											<SelectItem value={Departments.hr}>
												{t("settings.team.invite.form.departments.hr")}
											</SelectItem>
											<SelectItem value={Departments.admin}>
												{t("settings.team.invite.form.departments.admin")}
											</SelectItem>
											<SelectItem value={Departments.gov}>
												{t("settings.team.invite.form.departments.gov")}
											</SelectItem>
											<SelectItem value={Departments.itsm}>
												{t("settings.team.invite.form.departments.itsm")}
											</SelectItem>
											<SelectItem value={Departments.qms}>
												{t("settings.team.invite.form.departments.qms")}
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className="flex justify-between">
						<div />
						<Button
							type="submit"
							disabled={inviteMemberAction.status === "executing"}
							variant="action"
						>
							{inviteMemberAction.status === "executing" ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("settings.team.invite.button.sending")}
								</>
							) : isSuccess ? (
								<>
									<Check className="mr-2 h-4 w-4" />
									{t("settings.team.invite.button.sent")}
								</>
							) : (
								t("settings.team.invite.button.send")
							)}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
