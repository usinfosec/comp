import { Spinner } from "@comp/ui/spinner";

export default function TasksLoading() {
	return (
		<div className="flex items-center justify-center h-full">
			<Spinner size={20} />
		</div>
	);
}
