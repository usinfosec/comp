export const frameworks = {
	title: "Frameworks",
	overview: {
		error: "Failed to load frameworks",
		empty: {
			title: "No frameworks selected",
			description:
				"Select frameworks to get started with your compliance journey",
		},
		progress: {
			title: "Framework Progress",
			empty: {
				title: "No frameworks yet",
				description:
					"Get started by adding a compliance framework to track your progress",
				action: "Add Framework",
			},
		},
		grid: {
			welcome: {
				title: "Welcome to Comp AI",
				description:
					"Get started by selecting the compliance frameworks you would like to implement. We'll help you manage and track your compliance journey across multiple standards.",
				action: "Get Started",
			},
			title: "Select Frameworks",
			version: "Version",
			actions: {
				clear: "Clear",
				confirm: "Confirm Selection",
			},
		},
	},
	controls: {
		title: "Controls",
		description: "Review and manage compliance controls",
		table: {
			status: "Status",
			control: "Control",
			artifacts: "Artifacts",
			actions: "Actions",
			requirements: "Requirements",
		},
		statuses: {
			completed: "Completed",
			in_progress: "In Progress",
			not_started: "Not Started",
		},
	},
} as const;
