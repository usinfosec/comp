export default async function TaskLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="overflow-hidden">{children}</div>;
}
