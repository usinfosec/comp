import { deleteIntegrationConnectionAction } from "@/actions/integrations/delete-integration-connection";
import { retrieveIntegrationSessionTokenAction } from "@/actions/integrations/retrieve-integration-session-token";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@comp/ui/accordion";
import { Button } from "@comp/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { ScrollArea } from "@comp/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader } from "@comp/ui/sheet";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import {
	IntegrationSettings,
	type IntegrationSettingsItem,
} from "./integration-settings";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Calendar, Clock, Check, Globe } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Loader2 } from "lucide-react";
import { updateIntegrationSettingsAction } from "@/actions/integrations/update-integration-settings-action";
import { Input } from "@comp/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@comp/ui/tooltip";

// Add a type for the logo
export type LogoType = StaticImageData | { light: string; dark: string };

export function IntegrationsCard({
	id,
	logo,
	name,
	short_description,
	description,
	settings,
	images,
	active,
	installed,
	category,
	installedSettings,
	lastRunAt,
	nextRunAt,
}: {
	id: string;
	logo: LogoType;
	name: string;
	short_description: string;
	description: string;
	settings: IntegrationSettingsItem[] | Record<string, any> | any;
	images: any[];
	active: boolean;
	installed: boolean;
	category: string;
	installedSettings: Record<string, any>;
	lastRunAt?: Date | null;
	nextRunAt?: Date | null;
}) {
	const router = useRouter();

	// Add state to track if we're in edit mode for API key
	const [isEditingApiKey, setIsEditingApiKey] = useState(false);

	// Start with empty component
	const [params, setParams] = useQueryStates({
		app: parseAsString,
		settings: parseAsBoolean,
	});

	const retrieveIntegrationSessionToken = useAction(
		retrieveIntegrationSessionTokenAction,
	);

	const deleteIntegrationConnection = useAction(
		deleteIntegrationConnectionAction,
		{
			onSuccess: () => {
				toast.success("Integration disconnected successfully");
			},
			onError: () => {
				toast.error("Failed to disconnect integration");
			},
		},
	);

	const updateIntegrationSettings = useAction(updateIntegrationSettingsAction, {
		onSuccess: () => {
			toast.success("Settings updated successfully");
			setIsEditingApiKey(false); // Exit edit mode on success
		},
		onError: () => {
			toast.error("Failed to update settings");
		},
	});

	const [isLoading, setLoading] = useState(false);
	const [apiKeyInput, setApiKeyInput] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	// Debug output to see what settings contains
	console.log(`Integration ${name} settings:`, {
		id,
		settings,
		settingsIsArray: Array.isArray(settings),
		settingsLength: Array.isArray(settings) ? settings.length : "N/A",
		installedSettings,
	});

	const handleConnect = async () => {
		try {
			setLoading(true);
			setIsSaving(true);

			// Use the API key from the state
			const keyToUse = apiKeyInput.trim();
			if (!keyToUse) {
				toast.error("Please enter an API key");
				setLoading(false);
				setIsSaving(false);
				return;
			}

			// First save the API key if provided
			await updateIntegrationSettings.executeAsync({
				integration_id: id,
				option: { id: "api_key", value: keyToUse },
			});

			// Show appropriate message based on whether we're updating or setting for first time
			if (isEditingApiKey) {
				toast.success("API key updated successfully");
			} else {
				toast.success("API key saved successfully");
			}

			// If not already installed (first time setup), then retrieve session token to complete connection
			if (!installed) {
				const res = await retrieveIntegrationSessionToken.executeAsync({
					integrationId: id,
				});
			}

			// Handle success
			setApiKeyInput("");
			setIsEditingApiKey(false);
			router.refresh();
		} catch (error) {
			console.error("Connection error:", error);
			toast.error("Failed to connect integration");
		} finally {
			setLoading(false);
			setIsSaving(false);
		}
	};

	// Function to render the logo
	const renderLogo = () => {
		if (typeof logo === "string") {
			// It's a direct URL string
			return <img src={logo} alt={name} width={64} height={64} />;
		}

		if ("light" in logo && "dark" in logo) {
			// It's a URL-based logo object with light/dark variants
			return (
				<>
					<img
						src={logo.light}
						alt={name}
						width={64}
						height={64}
						className="dark:hidden"
					/>
					<img
						src={logo.dark}
						alt={name}
						width={64}
						height={64}
						className="hidden dark:block"
					/>
				</>
			);
		}

		// It's a StaticImageData or other object with src
		try {
			return <Image src={logo as any} alt={name} width={64} height={64} />;
		} catch (error) {
			console.error("Error rendering logo:", error);
			return (
				<div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
					{name.substring(0, 1)}
				</div>
			);
		}
	};

	// Function to get a friendly message about time to midnight UTC
	const getUTCMidnightMessage = (nextRunAt: Date): string => {
		if (!nextRunAt) return "";

		const now = new Date();
		const diffInMs = nextRunAt.getTime() - now.getTime();
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInMinutes = Math.floor(
			(diffInMs % (1000 * 60 * 60)) / (1000 * 60),
		);

		if (diffInHours <= 0 && diffInMinutes <= 0) {
			return "Running soon";
		}

		if (diffInHours === 0) {
			return `Runs in ${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`;
		}

		if (diffInMinutes === 0) {
			return `Runs in ${diffInHours} hour${diffInHours !== 1 ? "s" : ""}`;
		}

		return `Runs in ${diffInHours} hour${diffInHours !== 1 ? "s" : ""} and ${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`;
	};

	return (
		<Card key={id} className="w-full flex flex-col">
			<Sheet open={params.app === id} onOpenChange={() => setParams(null)}>
				<div className="pt-6 px-6 h-16 flex items-center justify-between">
					{renderLogo()}

					{installed && (
						<div className="text-green-600 bg-green-100 text-[10px] dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-none">
							Connected
						</div>
					)}
				</div>

				<CardHeader className="pb-0">
					<div className="flex items-center space-x-2 pb-4">
						<CardTitle className="text-md font-medium leading-none p-0 m-0">
							{name}
						</CardTitle>
						{!active && (
							<span className="text-muted-foreground text-[10px] px-3 py-1 font-mono">
								Coming soon
							</span>
						)}
					</div>
				</CardHeader>

				<CardContent className="text-xs text-muted-foreground pb-4">
					{short_description}
				</CardContent>

				<div className="px-6 pb-6 flex gap-2 mt-auto">
					<Button
						variant="outline"
						className="w-full"
						disabled={!active}
						onClick={() => setParams({ app: id })}
					>
						Configure {name}
					</Button>
				</div>

				<SheetContent className="h-full p-0 flex flex-col">
					<div className="p-6 pb-4 border-b">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								{renderLogo()}
								<div>
									<div className="flex items-center space-x-2">
										<h3 className="text-lg leading-none">{name}</h3>
										{installed && (
											<div className="bg-green-600 text-[9px] rounded-full size-1" />
										)}
									</div>

									<span className="text-xs text-muted-foreground">
										{category} • Published by Comp AI
									</span>
								</div>
							</div>
							<div>
								{installed && (
									<Button
										variant="outline"
										className="w-full"
										onClick={() => {
											deleteIntegrationConnection.executeAsync({
												integrationId: id,
											});
										}}
									>
										{deleteIntegrationConnection.status === "executing"
											? "Disconnecting..."
											: "Disconnect"}
									</Button>
								)}
							</div>
						</div>
					</div>

					{/* Main content area with scroll */}
					<div className="flex-1 overflow-hidden flex flex-col">
						<ScrollArea className="flex-1 px-6">
							<Accordion
								type="multiple"
								defaultValue={["description", "settings", "sync-status"]}
								className="mt-4 space-y-4"
							>
								<AccordionItem value="description" className="border-none">
									<AccordionTrigger className="py-3 hover:no-underline">
										<span className="text-sm font-medium">How it works</span>
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground text-sm pb-3">
										{description}
									</AccordionContent>
								</AccordionItem>

								{installed && (
									<AccordionItem value="sync-status" className="border-none">
										<AccordionTrigger className="py-3 hover:no-underline">
											<span className="text-sm font-medium">Sync Status</span>
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground text-sm pb-3">
											<div className="space-y-4">
												<div className="flex items-start gap-2">
													<Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
													<div>
														<div className="flex items-center gap-1">
															<p className="text-sm font-medium text-foreground">
																Last Sync
															</p>
															<TooltipProvider>
																<Tooltip>
																	<TooltipTrigger asChild>
																		<Globe className="h-3 w-3 text-muted-foreground cursor-help" />
																	</TooltipTrigger>
																	<TooltipContent>
																		<p>
																			Dates are shown in your local timezone
																		</p>
																	</TooltipContent>
																</Tooltip>
															</TooltipProvider>
														</div>
														{lastRunAt ? (
															<p className="text-xs text-muted-foreground">
																{format(new Date(lastRunAt), "PPP 'at' p")}
																<span className="text-xs text-muted-foreground ml-1">
																	(
																	{formatDistanceToNow(new Date(lastRunAt), {
																		addSuffix: true,
																	})}
																	)
																</span>
															</p>
														) : (
															<p className="text-xs text-muted-foreground">
																Never run
															</p>
														)}
													</div>
												</div>

												<div className="flex items-start gap-2">
													<Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
													<div>
														<div className="flex items-center gap-1.5">
															<p className="text-sm font-medium text-foreground">
																Next Sync
															</p>
															<div className="bg-muted text-xs rounded px-1.5 py-0.5">
																UTC 00:00
															</div>
															<TooltipProvider>
																<Tooltip>
																	<TooltipTrigger asChild>
																		<Globe className="h-3 w-3 text-muted-foreground cursor-help" />
																	</TooltipTrigger>
																	<TooltipContent
																		side="top"
																		align="start"
																		className="max-w-[250px]"
																	>
																		<p>
																			This integration runs at midnight UTC
																			(00:00). Times are converted to your local
																			timezone for display.
																		</p>
																	</TooltipContent>
																</Tooltip>
															</TooltipProvider>
														</div>
														{nextRunAt ? (
															<div className="space-y-0.5">
																<p className="text-xs text-muted-foreground">
																	{format(new Date(nextRunAt), "PPP 'at' p")}
																	<span className="text-xs text-muted-foreground ml-1">
																		(
																		{formatDistanceToNow(new Date(nextRunAt), {
																			addSuffix: true,
																		})}
																		)
																	</span>
																</p>
																<p className="text-xs text-muted-foreground flex items-center gap-1">
																	<span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
																	{getUTCMidnightMessage(nextRunAt)}
																</p>
															</div>
														) : (
															<p className="text-xs text-muted-foreground">
																{lastRunAt
																	? "Calculating..."
																	: "Will run at the next midnight UTC"}
															</p>
														)}
													</div>
												</div>

												<div className="text-xs bg-muted p-3 rounded-md">
													<p>
														This integration syncs automatically every day at
														midnight UTC (00:00).
													</p>
												</div>
											</div>
										</AccordionContent>
									</AccordionItem>
								)}

								<AccordionItem value="settings" className="border-none">
									<AccordionTrigger className="py-3 hover:no-underline">
										<span className="text-sm font-medium">Settings</span>
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground text-sm pb-3">
										{/* For Deel, always show the API key input */}
										{id === "deel" ? (
											<div className="space-y-4">
												{/* API Key status with checkmark if set */}
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<span className="font-medium text-foreground">
															API Key
														</span>
														{installedSettings?.api_key && (
															<div className="text-green-600">
																<Check className="h-4 w-4" />
															</div>
														)}
													</div>

													{/* Show update button when key is set and not in edit mode */}
													{installedSettings?.api_key && !isEditingApiKey ? (
														<Button
															variant="outline"
															size="sm"
															onClick={() => setIsEditingApiKey(true)}
														>
															Update
														</Button>
													) : null}
												</div>

												{/* Show input field either when:
													1. No API key is set yet, or
													2. User clicked the update button */}
												{(!installedSettings?.api_key || isEditingApiKey) && (
													<div className="space-y-4">
														<div className="space-y-2">
															<label
																htmlFor={`${id}-api-key`}
																className="text-sm font-medium leading-none"
															>
																{isEditingApiKey
																	? "Update API Key"
																	: "Enter API Key"}
															</label>
															<Input
																id={`${id}-api-key`}
																type="password"
																placeholder="Enter your Deel API key"
																value={apiKeyInput}
																onChange={(e) => setApiKeyInput(e.target.value)}
															/>
															<p className="text-xs text-muted-foreground">
																You can find your API key in your Deel account
																settings.
															</p>
														</div>
														<div className="flex gap-2">
															{isEditingApiKey && (
																<Button
																	type="button"
																	variant="outline"
																	className="flex-1"
																	onClick={() => setIsEditingApiKey(false)}
																>
																	Cancel
																</Button>
															)}
															<Button
																type="button"
																className="flex-1"
																onClick={handleConnect}
																disabled={isSaving}
															>
																{isSaving ? (
																	<>
																		<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																		Saving...
																	</>
																) : isEditingApiKey ? (
																	"Update"
																) : (
																	"Save"
																)}
															</Button>
														</div>
													</div>
												)}
											</div>
										) : Array.isArray(settings) && settings.length > 0 ? (
											<IntegrationSettings
												integrationId={id}
												settings={settings as IntegrationSettingsItem[]}
												installedSettings={installedSettings}
											/>
										) : (
											<p className="text-sm text-muted-foreground">
												No settings available
											</p>
										)}
									</AccordionContent>
								</AccordionItem>
							</Accordion>

							{/* Add extra space at the bottom to ensure content doesn't get cut off */}
							<div className="h-20" />
						</ScrollArea>
					</div>

					{/* Footer positioned at the bottom */}
					<div className="p-6 mt-auto border-t border-border">
						<p className="text-[10px] text-muted-foreground">
							All integrations on the Comp AI store are open-source and
							peer-reviewed.
						</p>

						<a
							href="mailto:support@trycomp.ai"
							className="text-[10px] text-red-500"
						>
							Report an issue
						</a>
					</div>
				</SheetContent>
			</Sheet>
		</Card>
	);
}
