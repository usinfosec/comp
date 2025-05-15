import { Control } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Badge } from "@comp/ui/badge";
import { PolicyControlMappingConfirmDeleteModal } from "./PolicyControlMappingConfirmDeleteModal";
import { PolicyControlMappingModal } from "./PolicyControlMappingModal";

export const PolicyControlMappings = ({
	mappedControls,
	allControls,
}: {
	mappedControls: Control[];
	allControls: Control[];
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between gap-2">
						Policy Mappings
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2 w-full">
				<h1 className="text-sm font-semibold">Controls</h1>
				<div className="flex flex-row flex-wrap w-full gap-2">
					{mappedControls.map((control) => (
						<div key={control.id} className="group">
							<Badge variant="outline" className="select-none">
								{control.name}
								<div className="hidden group-hover:block">
									<PolicyControlMappingConfirmDeleteModal
										control={control}
									/>
								</div>
							</Badge>
						</div>
					))}
					<PolicyControlMappingModal
						allControls={allControls}
						mappedControls={mappedControls}
					/>
				</div>
			</CardContent>
		</Card>
	);
};
