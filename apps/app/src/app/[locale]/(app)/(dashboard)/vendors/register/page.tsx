import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { VendorRegisterTable } from "./VendorRegisterTable";
import { Departments, VendorStatus } from "@bubba/db/types";
import { z } from "zod";

export default async function Page({
  params,
  searchParams,
}: {
  params: { locale: string },
  searchParams: Promise<{
    createVendorSheet?: string;
    page?: string;
    pageSize?: string;
    status?: string;
    department?: string;
    assigneeId?: string;
  }>
}) {
	const searchParamsSchema = z.object({
		createVendorSheet: z.string().optional(),
		page: z.string().regex(/^\d+$/).transform(Number).optional(),
		pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
		status: z.nativeEnum(VendorStatus).optional(),
		department: z.nativeEnum(Departments).optional(),
		assigneeId: z.string().uuid().optional()
	});

	const result = searchParamsSchema.safeParse(await searchParams);

	if (!result.success) {
		console.error('Invalid search params:', result.error);
		redirect('/vendors/register');
	}

	const { createVendorSheet, page, pageSize, status, department, assigneeId } = result.data;

	const session = await auth();

	if (!session?.user?.organizationId) {
		redirect("/onboarding");
	}

	const vendors = await db.vendor.findMany({
		where: {
			organizationId: session.user.organizationId,
			...(status && { status: status }),
			...(department && { department: department }),
			...(assigneeId && { ownerId: assigneeId })
		},
		include: {
			owner: true
		},
		skip: page ? (Number(page) - 1) * Number(pageSize || 10) : 0,
		take: Number(pageSize || 10)
	});

	return <VendorRegisterTable data={vendors} />;
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
		title: t("sub_pages.vendors.register"),
	};
}
