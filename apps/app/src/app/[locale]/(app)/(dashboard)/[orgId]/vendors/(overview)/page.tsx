import { auth } from "@comp/auth";
import { getI18n } from "@/locales/server";
import { db } from "@comp/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { VendorsTable } from "./components/VendorsTable";
import { Departments, VendorStatus } from "@comp/db/types";
import { z } from "zod";
import { headers } from "next/headers";
import { getServersideSession } from "@/lib/get-session";
import { cache } from "react";
import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";

export default async function Page({
	searchParams,
	params,
}: {
	searchParams: Promise<{
		createVendorSheet?: string;
		page?: string;
		pageSize?: string;
		status?: string;
		department?: string;
		assigneeId?: string;
	}>;
	params: Promise<{ orgId: string }>;
}) {
	const searchParamsSchema = z.object({
		createVendorSheet: z.string().optional(),
		page: z.string().regex(/^\d+$/).transform(Number).optional(),
		pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
		status: z.nativeEnum(VendorStatus).optional(),
		department: z.nativeEnum(Departments).optional(),
		assigneeId: z.string().uuid().optional(),
	});

	const result = searchParamsSchema.safeParse(await searchParams);
	const { orgId } = await params;

	if (!result.success) {
		console.error("Invalid search params:", result.error);
		redirect("/vendors/register");
	}

	const { createVendorSheet, page, pageSize, status, department, assigneeId } =
		result.data;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.session.activeOrganizationId) {
		redirect("/onboarding");
	}

	const vendors = await db.vendor.findMany({
		where: {
			organizationId: session.session.activeOrganizationId,
			...(status && { status: status }),
			...(department && { department: department }),
			...(assigneeId && { assigneeId: assigneeId }),
		},
		include: {
			assignee: {
				select: {
					user: true,
				},
			},
		},
		skip: page ? (Number(page) - 1) * Number(pageSize || 10) : 0,
		take: Number(pageSize || 10),
	});

	const assignees = await getAssignees();

	return (
		<PageWithBreadcrumb
			breadcrumbs={[
				{ label: "Vendors", href: `/${orgId}/vendors`, current: true },
			]}
		>
			<VendorsTable assignees={assignees} data={vendors} />
		</PageWithBreadcrumb>
	);
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
		title: t("vendors.register.title"),
	};
}

const getAssignees = cache(async () => {
	const {
		session: { activeOrganizationId },
	} = await getServersideSession({
		headers: await headers(),
	});

	if (!activeOrganizationId) {
		return [];
	}

	const assignees = await db.member.findMany({
		where: {
			organizationId: activeOrganizationId,
			role: {
				notIn: ["employee"],
			},
		},
		include: {
			user: true,
		},
	});

	return assignees;
});
