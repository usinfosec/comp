export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="max-w-[1200px] m-auto">
			<main className="mt-8">{children}</main>
		</div>
	);
}
