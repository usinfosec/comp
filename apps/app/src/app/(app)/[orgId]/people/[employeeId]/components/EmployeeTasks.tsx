import type { TrainingVideo } from "@/lib/data/training-videos";
import type {
	EmployeeTrainingVideoCompletion,
	Member,
	Policy,
	User,
} from "@comp/db/types";
import { Card, CardHeader, CardTitle, CardContent } from "@comp/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@comp/ui/tabs";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const EmployeeTasks = ({
	employee,
	policies,
	trainingVideos,
}: {
	employee: Member & {
		user: User;
	};
	policies: Policy[];
	trainingVideos: (EmployeeTrainingVideoCompletion & {
		metadata: TrainingVideo;
	})[];
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h2 className="text-lg font-medium">Employee Tasks</h2>
						<h3 className="text-sm text-muted-foreground">
							View and manage employee tasks and their status
						</h3>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="policies">
					<TabsList className="mb-4">
						<TabsTrigger value="policies">Policies</TabsTrigger>
						<TabsTrigger value="training">Training Videos</TabsTrigger>
						<TabsTrigger value="device">Device</TabsTrigger>
					</TabsList>

					<TabsContent value="policies">
						<div className="flex flex-col gap-2">
							{policies.length === 0 ? (
								<div className="text-center py-6 text-muted-foreground">
									<p>No policies required to sign.</p>
								</div>
							) : (
								policies.map((policy) => {
									const isCompleted = policy.signedBy.includes(employee.id);

									return (
										<div
											key={policy.id}
											className="flex items-center gap-2 border p-3 justify-between"
										>
											<h2 className="flex items-center gap-2">
												{isCompleted ? (
													<CheckCircle2 className="h-4 w-4 text-green-500" />
												) : (
													<AlertCircle className="h-4 w-4 text-red-500" />
												)}
												{policy.name}
											</h2>
										</div>
									);
								})
							)}
						</div>
					</TabsContent>

					<TabsContent value="training">
						<div className="flex flex-col gap-2">
							{trainingVideos.length === 0 ? (
								<div className="text-center py-6 text-muted-foreground">
									<p>No training videos required to watch.</p>
								</div>
							) : (
								trainingVideos.map((video) => {
									const isCompleted = video.completedAt !== null;

									return (
										<div
											key={video.id}
											className="flex items-center gap-2 border p-3 justify-between "
										>
											<h2 className="flex flex-col items-center">
												<div className="flex items-center gap-2">
													{isCompleted ? (
														<div className="flex items-center gap-1">
															<CheckCircle2 className="h-4 w-4 text-green-500" />
														</div>
													) : (
														<AlertCircle className="h-4 w-4 text-red-500" />
													)}
													{video.metadata.title}
												</div>
												{isCompleted && (
													<span className="text-xs text-muted-foreground self-start">
														Completed -{" "}
														{video.completedAt &&
															new Date(video.completedAt).toLocaleDateString()}
													</span>
												)}
											</h2>
										</div>
									);
								})
							)}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};
