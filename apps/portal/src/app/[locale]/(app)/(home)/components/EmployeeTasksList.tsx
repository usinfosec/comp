"use client";

import type {
	OrganizationPolicy,
	Policy,
	OrganizationTrainingVideos,
	PortalTrainingVideos,
} from "@bubba/db/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bubba/ui/tabs";
import { PolicyList } from "./policy";
import { VideoCarousel } from "./video";
import { trainingVideos } from "../data";
import type { Session } from "@/app/lib/auth";

interface EmployeeTasksListProps {
	policies: (OrganizationPolicy & { policy: Policy })[];
	trainingVideos: (OrganizationTrainingVideos & {
		trainingVideo: PortalTrainingVideos;
	})[];
	user: Session["user"];
}

export const EmployeeTasksList = ({
	policies,
	trainingVideos,
	user,
}: EmployeeTasksListProps) => {
	return (
		<Tabs defaultValue="policies">
			<TabsList className="bg-transparent border-b-[1px] w-full justify-start rounded-none mb-1 p-0 h-auto pb-4">
				<TabsTrigger value="policies">Policies</TabsTrigger>
				<TabsTrigger value="training">Training</TabsTrigger>
			</TabsList>
			<TabsContent value="policies" className="py-2">
				<PolicyList policies={policies} user={user} />
			</TabsContent>
			<TabsContent value="training" className="py-2">
				<VideoCarousel videos={trainingVideos} user={user} />
			</TabsContent>
		</Tabs>
	);
};
