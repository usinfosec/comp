"use client";

import { useI18n } from "@/locales/client";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import type { EmployeeWithUser } from "./EmployeesList";
import { useParams, useRouter } from "next/navigation";

interface EmployeeRowProps {
	employee: EmployeeWithUser;
}

function getInitials(name?: string | null, email?: string | null): string {
	if (name) {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	}
	if (email) {
		return email.substring(0, 2).toUpperCase();
	}
	return "??";
}

export function EmployeeRow({ employee }: EmployeeRowProps) {
	const t = useI18n();
	const router = useRouter();
	const params = useParams<{ locale: string; orgId: string }>();

	const employeeName =
		employee.user.name || employee.user.email || "Employee";
	const employeeEmail = employee.user.email || "";
	const employeeAvatar = employee.user.image;

	return (
		<div
			className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
			onClick={() =>
				router.push(
					`/${params.locale}/${params.orgId}/employees/${employee.id}`,
				)
			}
		>
			<div className="flex items-center gap-3">
				<Avatar>
					<AvatarImage src={employeeAvatar || undefined} />
					<AvatarFallback>
						{getInitials(employee.user.name, employee.user.email)}
					</AvatarFallback>
				</Avatar>
				<div>
					<div className="font-medium">{employeeName}</div>
					<div className="text-sm text-muted-foreground">
						{employeeEmail}
					</div>
				</div>
			</div>
		</div>
	);
}
