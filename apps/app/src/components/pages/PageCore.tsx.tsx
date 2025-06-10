export default function PageCore({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-4 bg-background p-4 rounded-lg">
			{children}
		</div>
	);
}
