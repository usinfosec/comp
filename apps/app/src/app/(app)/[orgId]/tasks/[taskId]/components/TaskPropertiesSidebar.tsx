import type {
	Departments,
	Member,
	Task,
	TaskFrequency,
	TaskStatus,
	User,
} from "@comp/db/types";
import { PropertySelector } from "./PropertySelector";
import {
	taskStatuses,
	taskFrequencies,
	taskDepartments,
	DEPARTMENT_COLORS,
} from "./constants";
import { TaskStatusIndicator } from "../../components/TaskStatusIndicator";
import { Button } from "@comp/ui/button";
import { Badge } from "@comp/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

interface TaskPropertiesSidebarProps {
	task: Task;
	members?: (Member & { user: User })[];
	assignedMember: (Member & { user: User }) | null | undefined; // Allow undefined
	handleUpdateTask: (
		data: Partial<
			Pick<Task, "status" | "assigneeId" | "frequency" | "department">
		>,
	) => void;
	onDeleteClick?: () => void;
}

export function TaskPropertiesSidebar({
	task,
	members,
	assignedMember,
	handleUpdateTask,
	onDeleteClick,
}: TaskPropertiesSidebarProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	return (
		<aside className="w-full md:w-64 lg:w-72 shrink-0 md:border-l md:pt-8 md:pl-8 hidden lg:flex flex-col">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
					Properties
				</h2>
				<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button size="icon" variant="ghost" className="p-2 m-0 size-auto">
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => {
								setDropdownOpen(false);
								if (onDeleteClick) onDeleteClick();
							}}
							className="text-destructive focus:text-destructive"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="space-y-4 overflow-y-auto">
				{/* Status Selector */}
				<div className="flex justify-between items-center text-base group">
					<span className="text-muted-foreground">Status</span>
					<PropertySelector<TaskStatus>
						value={task.status}
						options={taskStatuses}
						getKey={(status) => status}
						renderOption={(status) => (
							<div className="flex items-center gap-2">
								<TaskStatusIndicator status={status} />
								<span className="capitalize">{status.replace("_", " ")}</span>
							</div>
						)}
						onSelect={(selectedStatus) => {
							handleUpdateTask({
								status: selectedStatus as TaskStatus,
							});
						}}
						trigger={
							<Button
								variant="ghost"
								className="w-auto h-auto py-0.5 px-2 font-medium capitalize hover:bg-muted data-[state=open]:bg-muted flex items-center gap-2"
							>
								<TaskStatusIndicator status={task.status} />
								{task.status.replace("_", " ")}
							</Button>
						}
						searchPlaceholder="Change status..."
						emptyText="No status found."
						contentWidth="w-48"
					/>
				</div>

				{/* Assignee Selector */}
				<div className="flex justify-between items-center text-base group">
					<span className="text-muted-foreground">Assignee</span>
					<PropertySelector<Member & { user: User }>
						value={task.assigneeId}
						options={members ?? []}
						getKey={(member) => member.id}
						renderOption={(member) => (
							<div className="flex items-center gap-2">
								<Avatar className="w-5 h-5">
									{member.user?.image && (
										<AvatarImage
											src={member.user.image}
											alt={member.user.name ?? ""}
										/>
									)}
									<AvatarFallback>
										{member.user?.name?.charAt(0) ?? "?"}
									</AvatarFallback>
								</Avatar>
								<span>{member.user.name}</span>
							</div>
						)}
						onSelect={(selectedAssigneeId) => {
							handleUpdateTask({
								assigneeId:
									selectedAssigneeId === null ? null : selectedAssigneeId,
							});
						}}
						trigger={
							<Button
								variant="ghost"
								className="w-auto h-auto py-0.5 px-2 hover:bg-muted data-[state=open]:bg-muted flex items-center gap-1.5 justify-end"
								disabled={members?.length === 0}
							>
								{assignedMember ? (
									<>
										<Avatar className="w-4 h-4">
											{assignedMember.user?.image && (
												<AvatarImage
													src={assignedMember.user.image}
													alt={assignedMember.user.name ?? ""}
												/>
											)}
											<AvatarFallback className="text-[10px]">
												{assignedMember.user?.name?.charAt(0) ?? "?"}
											</AvatarFallback>
										</Avatar>
										<span className="text-foreground font-medium">
											{assignedMember.user.name}
										</span>
									</>
								) : (
									<span className="text-muted-foreground">Unassigned</span>
								)}
							</Button>
						}
						searchPlaceholder="Change assignee..."
						emptyText="No member found."
						contentWidth="w-56"
						disabled={members?.length === 0}
						allowUnassign={true} // Enable unassign option
					/>
				</div>

				{/* Frequency Selector */}
				<div className="flex justify-between items-center text-base group">
					<span className="text-muted-foreground">Frequency</span>
					<PropertySelector<TaskFrequency>
						value={task.frequency}
						options={taskFrequencies}
						getKey={(freq) => freq}
						renderOption={(freq) => (
							<span className="capitalize">{freq.replace("_", " ")}</span>
						)}
						onSelect={(selectedFreq) => {
							// Pass null directly if 'None' (unassign) was selected
							handleUpdateTask({
								frequency:
									selectedFreq === null
										? null
										: (selectedFreq as TaskFrequency),
							});
						}}
						trigger={
							<Button
								variant="ghost"
								className="w-auto h-auto py-0.5 px-2 font-medium capitalize hover:bg-muted data-[state=open]:bg-muted"
							>
								{task.frequency ? task.frequency.replace("_", " ") : "None"}
							</Button>
						}
						searchPlaceholder="Change frequency..."
						emptyText="No frequency found."
						contentWidth="w-48"
						allowUnassign={true}
						unassignLabel="None"
					/>
				</div>

				{/* Department Selector */}
				<div className="flex justify-between items-center text-base group">
					<span className="text-muted-foreground">Department</span>
					<PropertySelector<Departments>
						value={task.department ?? "none"}
						options={taskDepartments}
						getKey={(dept) => dept}
						renderOption={(dept) => {
							if (dept === "none") {
								// Render 'none' as plain text
								return <span className="text-muted-foreground">None</span>;
							}
							// Render other departments as colored badges
							const mainColor =
								DEPARTMENT_COLORS[dept] ?? DEPARTMENT_COLORS.none;
							const lightBgColor = `${mainColor}1A`; // Add opacity for lighter background
							return (
								<Badge
									className="font-normal uppercase text-xs px-1.5 py-0 border-l-2"
									style={{
										backgroundColor: lightBgColor,
										color: mainColor,
										borderLeftColor: mainColor,
									}}
								>
									{dept}
								</Badge>
							);
						}}
						onSelect={(selectedDept) => {
							handleUpdateTask({
								department: selectedDept as Departments,
							});
						}}
						trigger={
							<Button
								variant="ghost"
								// Adjust class slightly to handle text vs badge alignment if needed
								className="w-auto h-auto p-0 px-1 hover:bg-transparent data-[state=open]:bg-transparent flex items-center justify-end"
							>
								{(() => {
									const currentDept = task.department ?? "none";
									if (currentDept === "none") {
										// Render 'None' as plain text for the trigger
										return (
											<span className="text-muted-foreground px-1">None</span>
										);
									}
									// Render other departments as colored badges
									const mainColor =
										DEPARTMENT_COLORS[currentDept] ?? DEPARTMENT_COLORS.none; // Fallback
									const lightBgColor = `${mainColor}1A`; // Add opacity
									return (
										<Badge
											className="font-normal uppercase text-xs px-1.5 py-0.5 border-l-2 hover:opacity-80"
											style={{
												backgroundColor: lightBgColor,
												color: mainColor,
												borderLeftColor: mainColor,
											}}
										>
											{currentDept}
										</Badge>
									);
								})()}
							</Button>
						}
						searchPlaceholder="Change department..."
						emptyText="No department found."
						contentWidth="w-48"
					/>
				</div>
			</div>
		</aside>
	);
}
