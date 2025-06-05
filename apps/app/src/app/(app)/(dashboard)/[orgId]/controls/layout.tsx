export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="max-w-[1200px] mx-auto">
			<div>{children}</div>
		</div>
	);
}
