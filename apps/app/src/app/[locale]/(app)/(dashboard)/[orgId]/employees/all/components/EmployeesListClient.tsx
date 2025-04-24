"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent } from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { Separator } from "@comp/ui/separator";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { EmployeeRow } from "./EmployeeRow";
import type { EmployeeWithUser } from "./EmployeesList";

interface EmployeesListClientProps {
	data: EmployeeWithUser[];
	organizationId: string;
}

interface DisplayItem extends EmployeeWithUser {
	displayName: string;
	displayEmail: string;
	id: string;
}

export function EmployeesListClient({
	data,
	organizationId,
}: EmployeesListClientProps) {
	const t = useI18n();
	const [searchQuery, setSearchQuery] = useState("");

	const allItems: DisplayItem[] = data.map((employee) => ({
		...employee,
		displayName: employee.user.name || employee.user.email || "",
		displayEmail: employee.user.email || "",
		id: employee.id,
	}));

	const filteredItems = allItems.filter(
		(item) =>
			item.displayName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			item.displayEmail.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="">
			<Card className="border">
				<CardContent className="p-0">
					<div className="p-4 border-b">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={t("people.list.searchPlaceholder")}
								className="pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							{searchQuery && (
								<button
									type="button"
									className="absolute right-1.5 top-1.5 h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
									onClick={() => setSearchQuery("")}
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>

					{filteredItems.length > 0 ? (
						filteredItems.map((item, index) => (
							<div key={item.id}>
								<EmployeeRow employee={item} />
								{index < filteredItems.length - 1 && (
									<Separator />
								)}
							</div>
						))
					) : (
						<div className="p-4 text-center text-muted-foreground">
							{t("people.list.emptyState")}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
