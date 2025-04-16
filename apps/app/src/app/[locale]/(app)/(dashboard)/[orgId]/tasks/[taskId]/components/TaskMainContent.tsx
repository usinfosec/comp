import { Task } from "@comp/db/types";
import { Avatar, AvatarFallback } from "@comp/ui/avatar";
import { Button } from "@comp/ui/button";
import { Separator } from "@comp/ui/separator";
import { Textarea } from "@comp/ui/textarea";
import { Paperclip, SendHorizonal } from "lucide-react";
import { ScrollArea } from "@comp/ui/scroll-area";

// TODO: Define a proper activity type if needed
interface Activity {
	type: string;
	user: string;
	text?: string;
	time: string;
	label?: string;
}

interface TaskMainContentProps {
	task: Task;
	activities: Activity[];
}

export function TaskMainContent({ task, activities }: TaskMainContentProps) {
	return (
		<div className="flex-1 flex flex-col gap-6 pr-4">
			{/* Task Title */}
			<h1 className="text-2xl font-semibold tracking-tight pt-6 flex-shrink-0">
				{task.title}
			</h1>

			{/* Wrap scrollable content */}
			<ScrollArea className="flex-1 pb-6">
				<div className="flex flex-col gap-6">
					{/* Description - Placeholder for editable/display */}
					<div className="text-muted-foreground">
						{task.description || "Add description..."}
					</div>

					<Separator />

					{/* Activity Feed */}
					<div className="space-y-4">
						<h2 className="text-sm font-medium text-muted-foreground">
							Activity
						</h2>
						{/* TODO: Replace with actual activity/comment rendering */}
						{activities.map((activity, index) => (
							<div
								key={index}
								className="text-sm text-muted-foreground flex gap-2 items-start"
							>
								<Avatar className="w-5 h-5 mt-0.5">
									{/* Placeholder */}
									<AvatarFallback>
										{activity.user.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<span className="font-medium text-foreground">
										{activity.user}
									</span>
									{activity.type === "creation" &&
										` created the issue · ${activity.time}`}
									{activity.type === "comment" &&
										` commented · ${activity.time}`}
									{activity.type === "label" &&
										` added label ${activity.label} · ${activity.time}`}
									{activity.type === "comment" && (
										<p className="text-foreground mt-1">
											{activity.text}
										</p>
									)}
								</div>
							</div>
						))}
					</div>

					{/* Comment Input */}
					<div className="border rounded p-3 space-y-2">
						<Textarea
							placeholder="Leave a comment..."
							className="min-h-[80px] border-none focus-visible:ring-0 shadow-none p-0"
						/>
						<div className="flex justify-between items-center">
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground h-8 w-8"
							>
								<Paperclip className="h-4 w-4" />
							</Button>
							<Button size="sm">
								Comment{" "}
								<SendHorizonal className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
