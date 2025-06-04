export default function TestsDashboardLayout({
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
