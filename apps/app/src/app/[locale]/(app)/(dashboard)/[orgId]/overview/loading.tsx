import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Skeleton } from "@bubba/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-12">
			<div className="grid gap-4 md:grid-cols-2">
				{/* Framework Progress Card Skeleton */}
				<Card className="h-[382px]">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>
							<Skeleton className="h-5 w-[146px]" />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col space-y-7">
							{/* Main compliance circle */}
							<div className="flex justify-center">
								<Skeleton className="h-32 w-32 rounded-full" />
							</div>

							{/* Three smaller circles */}
							<div className="grid grid-cols-3 gap-4">
								{["policies", "evidence", "tests"].map((item) => (
									<div
										key={`progress-${item}`}
										className="flex flex-col items-center"
									>
										<Skeleton className="h-24 w-24 rounded-full" />
										<Skeleton className="mt-2 h-4 w-16" />
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Requirements Status Card Skeleton */}
				<Card className="h-[382px]">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>
							<Skeleton className="h-5 w-[87px]" />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-7">
							<div className="space-y-6">
								{["framework1", "framework2", "framework3"].map((item) => (
									<div
										key={`framework-${item}`}
										className="flex items-start gap-4 rounded-lg p-4"
									>
										<Skeleton className="flex-shrink-0 h-12 w-12 rounded-full" />
										<div className="flex-1 space-y-2">
											<div className="flex items-center justify-between">
												<Skeleton className="h-5 w-2/3" />
												<Skeleton className="h-4 w-24" />
											</div>
											<Skeleton className="h-2 w-full" />
										</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
