import { LogoSpinner } from "@/components/logo-spinner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comp/ui/tabs";

export default async function Loading() {
	return (
		<div className="space-y-4 sm:space-y-8">
			<Tabs defaultValue="members">
				<TabsList className="bg-transparent border-b-[1px] w-full justify-start rounded-sm mb-1 p-0 h-auto pb-4">
					<TabsTrigger value="members" className="p-0 m-0 mr-4">
						{"Members"}
					</TabsTrigger>
					<TabsTrigger value="invite" className="p-0 m-0">
						{"Invite"}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="members">
					<Card>
						<CardHeader>
							<CardTitle>
								{"Team Members"}
							</CardTitle>
							<CardDescription />
						</CardHeader>
						<CardContent>
							<LogoSpinner />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="invite">
					<div className="flex flex-col gap-4">
						<Card>
							<CardHeader className="blur-sm">
								<CardTitle>
									{"Invite Members"}
								</CardTitle>
								<CardDescription>
									{"Invite new members to join your organization."}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<LogoSpinner />
							</CardContent>
							<div className="p-4 flex justify-end">
								<div className="h-10 w-24 bg-muted rounded blur-sm" />
							</div>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
