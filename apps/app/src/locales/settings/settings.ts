export const settings = {
	general: {
		title: "General",
		org_name: "Organization name",
		org_name_description:
			"This is your organizations visible name. You should use the legal name of your organization.",
		org_name_tip: "Please use 32 characters at maximum.",
		org_website: "Organization Website",
		org_website_description:
			"This is your organization's official website. Include https:// in the URL.",
		org_website_tip: "Please enter a valid URL including https://",
		org_website_error: "Error updating organization website",
		org_website_updated: "Organization website updated",
		org_delete: "Delete organization",
		org_delete_description:
			"Permanently remove your organization and all of its contents from the Comp AI platform. This action is not reversible - please continue with caution.",
		org_delete_alert_title: "Are you absolutely sure?",
		org_delete_alert_description:
			"This action cannot be undone. This will permanently delete your organization and remove your data from our servers.",
		delete_confirm_tip: "Type 'delete' to confirm",
		delete_confirm: "delete",
		org_delete_error: "Error deleting organization",
		org_delete_success: "Organization deleted",
		org_name_updated: "Organization name updated",
		org_name_error: "Error updating organization name",
	},
	users: {
		title: "User Management",
	},
	team: {
		tabs: {
			members: "Members",
			invite: "Invite",
		},
		members: {
			title: "Team Members",
			description: "Manage your team members and their roles.",
		},
		invite: {
			title: "Invite Members",
			description: "Invite new members to join your organization.",
		},
	},
	api_keys: {
		title: "API",
		description:
			"Manage API keys for programmatic access to your organization's data.",
		list_title: "API Keys",
		list_description:
			"API keys allow secure access to your organization's data via our API.",
		create: "New API Key",
		create_title: "New API Key",
		create_description:
			"Create a new API key for programmatic access to your organization's data.",
		created_title: "API Key Created",
		created_description:
			"Your API key has been created. Make sure to copy it now as you won't be able to see it again.",
		name: "Name",
		name_placeholder: "Enter a name for this API key",
		expiration: "Expiration",
		expiration_placeholder: "Select expiration",
		thirty_days: "30 days",
		ninety_days: "90 days",
		one_year: "1 year",
		api_key: "API Key",
		save_warning:
			"This key will only be shown once. Make sure to copy it now.",
		copied: "API key copied to clipboard",
		revoke_confirm:
			"Are you sure you want to revoke this API key? This action cannot be undone.",
		revoke_title: "Revoke API Key",
		revoke: "Revoke",
		created: "Created",
		expires: "Expires",
		last_used: "Last Used",
		actions: "Actions",
		never: "Never",
		never_used: "Never used",
		no_keys: "No API keys found. Create one to get started.",
		security_note:
			"API keys provide full access to your organization's data. Keep them secure and rotate them regularly.",
		fetch_error: "Failed to fetch API keys",
		create_error: "Failed to create API key",
		revoked_success: "API key revoked successfully",
		revoked_error: "Failed to revoke API key",
		done: "Done",
	},
	billing: {
		title: "Billing",
	},
	trust_portal: {
		friendly_url: {
			available: "This URL is available!",
			unavailable: "This URL is already taken.",
			checking: "Checking availability...",
		},
	},
} as const;
