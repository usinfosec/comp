import { getI18n } from "@/locales/server";
import { db } from "@comp/db";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@comp/ui/breadcrumb";

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { employeeId: string; orgId: string };
}) {
	const { employeeId, orgId } = params;
	const t = await getI18n();

	const member = await db.member.findUnique({
		where: {
			id: employeeId,
		},
		select: {
			user: {
				select: {
					name: true,
				},
			},
		},
	});

	return (
		<div className="max-w-[1200px] m-auto flex flex-col gap-4">
				{member?.user?.name && (
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href={`/${orgId}/people`}>
										{t("people.title")}
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>
										{member.user.name}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>

				)}
				{children}
		</div>
	);
}
