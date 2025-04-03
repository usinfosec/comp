"use server";

import { DataTable } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/[vendorId]/components/tasks/data-table/data-table";
import {
	NoResults,
	NoTasks,
} from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/[vendorId]/components/tasks/data-table/empty-states";
import { FilterToolbar } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/[vendorId]/components/tasks/data-table/filter-toolbar";
import { Loading } from "@/components/frameworks/loading";
import { getI18n } from "@/locales/server";
import { auth } from "@comp/auth";
import { db } from "@comp/db";
import type { TaskStatus } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { InherentRiskVendorChart } from "./components/inherent-risk-vendor-chart";
import { ResidualRiskVendorChart } from "./components/residual-risk-vendor-chart";
import { SecondaryFields } from "./components/secondary-fields/secondary-fields";
import { TitleAndDescription } from "./components/title-and-description/title-and-description";

interface PageProps {
	searchParams: Promise<{
		search?: string;
		status?: string;
		sort?: string;
		page?: string;
		per_page?: string;
	}>;
	params: Promise<{ vendorId: string; locale: string }>;
}

export default async function VendorPage({ searchParams, params }: PageProps) {
	const { vendorId } = await params;
	const vendor = await getVendor(vendorId);
	const assignees = await getAssignees();
	const t = await getI18n();

	const {
		search,
		status,
		sort,
		page = "1",
		per_page = "5",
	} = await searchParams;

	const [column, order] = sort?.split(":") ?? [];
	const hasFilters = !!(search || status);

	const { tasks: loadedTasks, total } = await getTasks({
		vendorId,
		search,
		status: status as TaskStatus,
		column,
		order,
		page: Number.parseInt(page),
		per_page: Number.parseInt(per_page),
	});

	if (!vendor) {
		redirect("/");
	}

	return (
		<div className="flex flex-col gap-4">
			<TitleAndDescription vendor={vendor} />
			<SecondaryFields vendor={vendor} assignees={assignees} />
			{/* <Card>
				<CardHeader>
					<CardTitle>
						<div className="flex items-center justify-between gap-2">
							{t("vendors.tasks.title")}
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="relative">
						{loadedTasks.length > 0 ? (
							<>
								<FilterToolbar
									isEmpty={loadedTasks.length === 0}
									users={users}
								/>
								<DataTable
									data={loadedTasks}
									pageCount={Math.ceil(total / Number.parseInt(per_page))}
									currentPage={Number.parseInt(page)}
								/>
							</>
						) : hasFilters ? (
							<NoResults hasFilters={hasFilters} />
						) : (
							<>
								<NoTasks isEmpty={true} />
								<Loading isEmpty={true} amount={3} />
							</>
						)}
					</div>
				</CardContent>
			</Card> */}
			<div className="grid grid-cols-1 gap-4">
				<InherentRiskVendorChart vendor={vendor} />
				<ResidualRiskVendorChart vendor={vendor} />
			</div>
		</div>
	);
}

async function getVendor(vendorId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		return null;
	}

	const vendor = await db.vendor.findUnique({
		where: {
			id: vendorId,
			organizationId: session.session.activeOrganizationId,
		},
		include: {
			assignee: {
				include: {
					user: true,
				},
			},
		},
	});

	return vendor;
}

async function getAssignees() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		return [];
	}

	const assignees = await db.member.findMany({
		where: {
			organizationId: session.session.activeOrganizationId,
			role: {
				notIn: ["employee"],
			},
		},
		include: {
			user: true,
		},
	});

	return assignees;
}

async function getTasks({
	vendorId,
	search,
	status,
	column,
	order,
	page = 1,
	per_page = 10,
}: {
	vendorId: string;
	search?: string;
	status?: TaskStatus;
	column?: string;
	order?: string;
	page?: number;
	per_page?: number;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.session.activeOrganizationId) {
		return { tasks: [], total: 0 };
	}

	const skip = (page - 1) * per_page;

	const [tasks, total] = await Promise.all([
		db.task
			.findMany({
				where: {
					relatedId: vendorId,
					AND: [
						search
							? {
									OR: [
										{ title: { contains: search, mode: "insensitive" } },
										{
											description: { contains: search, mode: "insensitive" },
										},
									],
								}
							: {},
						status ? { status } : {},
					],
				},
				orderBy: column
					? {
							[column]: order === "asc" ? "asc" : "desc",
						}
					: {
							createdAt: "desc",
						},
				skip,
				take: per_page,
				include: {
					assignee: {
						include: {
							user: true,
						},
					},
				},
			})
			.then((tasks) =>
				tasks.map((task) => ({
					...task,
					dueDate: task.dueDate ?? new Date(),
					assignee: {
						name: task.assignee?.user.name ?? "",
						image: task.assignee?.user.image ?? "",
					},
				})),
			),
		db.task.count({
			where: {
				relatedId: vendorId,
				AND: [
					search
						? {
								OR: [
									{ title: { contains: search, mode: "insensitive" } },
									{ description: { contains: search, mode: "insensitive" } },
								],
							}
						: {},
					status ? { status } : {},
				],
			},
		}),
	]);

	return { tasks, total };
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("sidebar.vendors"),
	};
}
