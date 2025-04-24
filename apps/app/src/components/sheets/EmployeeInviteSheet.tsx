"use client";

import { useEmployees } from "@/app/[locale]/(app)/(dashboard)/[orgId]/employees/all/hooks/useEmployees";
import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@comp/ui/drawer";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@comp/ui/form";
import { Input } from "@comp/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@comp/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Departments } from "@prisma/client";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useMediaQuery } from "../../../../../packages/ui/src/hooks/use-media-query";

const DEPARTMENTS: Departments[] = [
	"none",
	"admin",
	"gov",
	"hr",
	"it",
	"itsm",
	"qms",
];

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().email({ message: "Invalid email address" }),
	department: z.enum(DEPARTMENTS as [string, ...string[]]),
});

type EmployeeInviteFormData = z.infer<typeof formSchema>;

export function EmployeeInviteSheet() {
	const t = useI18n();
	const [open, setOpen] = useQueryState("employee-invite-sheet");
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const form = useForm<EmployeeInviteFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			department: "none",
		},
	});

	const { addEmployee, isMutating } = useEmployees({
		search: "",
		role: "",
		page: 1,
		per_page: 10,
	});

	const processSubmit = async (values: EmployeeInviteFormData) => {
		try {
			await addEmployee({
				name: values.name,
				email: values.email.trim(),
				department: values.department,
			});

			toast.success(t("people.invite.success"));
			form.reset();
			setOpen(null);
		} catch (error) {
			toast.error(t("errors.unexpected"));
		}
	};

	const renderFormContent = () => (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processSubmit)}
				className="flex flex-col h-full"
			>
				<SheetHeader className="mb-4">
					<SheetTitle>{t("people.invite.title")}</SheetTitle>
					<SheetDescription>
						{t("people.invite.description")}
					</SheetDescription>
				</SheetHeader>

				<div className="space-y-4 py-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t("people.invite.name.label")}
								</FormLabel>
								<FormControl>
									<Input
										placeholder={t(
											"people.invite.name.placeholder",
										)}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t("people.invite.email.label")}
								</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder={t(
											"people.invite.email.placeholder",
										)}
										{...field}
									/>
								</FormControl>
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
									{t("people.invite.department.label")}
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger id="department">
											<SelectValue
												placeholder={t(
													"people.invite.department.placeholder",
												)}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{DEPARTMENTS.map((dept) => (
											<SelectItem key={dept} value={dept}>
												{dept === "none"
													? t(
															"people.invite.department.none",
														)
													: dept.toUpperCase()}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<SheetFooter>
					<Button
						type="submit"
						disabled={isMutating || !form.formState.isValid}
						isLoading={isMutating}
					>
						{isMutating
							? t("people.invite.submitting")
							: t("people.invite.submit")}
					</Button>
				</SheetFooter>
			</form>
		</Form>
	);

	if (isDesktop) {
		return (
			<Sheet
				open={open === "true"}
				onOpenChange={(open) => setOpen(open ? "true" : null)}
			>
				<SheetContent>{renderFormContent()}</SheetContent>
			</Sheet>
		);
	}

	return (
		<Drawer
			open={open === "true"}
			onOpenChange={(open) => setOpen(open ? "true" : null)}
		>
			<DrawerTitle hidden>{t("people.invite.title")}</DrawerTitle>
			<DrawerContent className="p-6">{renderFormContent()}</DrawerContent>
		</Drawer>
	);
}
