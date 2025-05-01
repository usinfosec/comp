export const people = {
	title: "People",
	all: "All Roles",
	all_employees: "Employees",
	details: {
		title: "Employee Details",
		tasks: "Tasks",
	},
	status: {
		active: "Active",
		inactive: "Inactive",
	},
	description: "Manage your team members and their roles.",
	user_management: {
		title: "User Management",
	},
	filters: {
		search: "Search people...",
		role: "Filter by role",
		all_roles: "All Roles",
	},
	actions: {
		invite: "Add User",
		clear: "Clear filters",
	},
	table: {
		name: "Name",
		email: "Email",
		department: "Department",
		status: "Status",
	},
	empty: {
		no_employees: {
			title: "No employees yet",
			description: "Get started by inviting your first team member.",
		},
		no_results: {
			title: "No results found",
			description: "No employees match your search",
			description_with_filters: "Try adjusting your filters",
		},
	},
	roles: {
		owner: "Owner",
		admin: "Admin",
		member: "Member",
		auditor: "Auditor",
		employee: "Employee",
		owner_description:
			"Can manage users, policies, tasks, and settings, and delete organization.",
		admin_description:
			"Can manage users, policies, tasks, and settings.",
		employee_description: "Can sign policies and complete training.",
		auditor_description: "Read-only access for compliance checks.",
	},
	member_actions: {
		actions: "Actions",
		edit_roles: "Edit Roles",
		remove_member: "Remove Member",
		view_profile: "View Profile",
		remove_confirm: {
			title: "Remove Team Member",
			description_prefix: "Are you sure you want to remove",
			description_suffix: "This action cannot be undone.",
		},
		role_dialog: {
			title: "Change Role",
			title_edit: "Edit Member Roles",
			description_prefix: "Update the role for",
			role_label: "Role(s)",
			role_placeholder: "Select role(s)",
			owner_note:
				"The Owner role cannot be removed but additional roles can be added.",
			at_least_one_role_note: "At least one role is required.",
			last_role_tooltip: "At least one role is required",
		},
		toast: {
			remove_success: "has been removed from the organization",
			remove_error: "Failed to remove member",
			remove_unexpected:
				"An unexpected error occurred while removing the member",
			update_role_success: "Member roles updated successfully.",
			update_role_error: "Failed to update member roles",
			update_role_unexpected:
				"An unexpected error occurred while updating the member's roles",
			cannot_remove_owner: "The Owner role cannot be removed.",
			select_at_least_one_role: "Please select at least one role.",
		},
	},
	invite: {
		title: "Add User",
		description: "Add an employee to your organization.",
		pending: "Pending Invitations",
		email: {
			label: "Email address",
			placeholder: "Enter email address",
		},
		role: {
			label: "Role(s)",
			placeholder: "Select role(s)",
		},
		name: {
			label: "Name",
			placeholder: "Enter name",
		},
		department: {
			label: "Department",
			placeholder: "Select a department",
			none: "None",
		},
		csv: {
			label: "CSV File",
			description:
				"Upload a CSV file with email and role columns. The role can be one of: admin, employee, or auditor.",
			download_template: "Download Template",
		},
		submit: "Invite",
		submitting: "Adding Employee...",
		success:
			"Employee added successfully, they will receive an email to join the portal.",
		error: "Failed to add user",
	},
	dashboard: {
		title: "Dashboard",
		employee_task_completion: "Employee Task Completion",
		policies_completed: "Policies Completed",
		policies_pending: "Policies Pending",
		trainings_completed: "Trainings Completed",
		trainings_pending: "Trainings Pending",
		policies: "Policies",
		trainings: "Trainings",
		completed: "Completed",
		not_completed: "Not Completed",
		no_data: "No employee data available",
		no_tasks_completed: "No tasks have been completed yet",
		no_tasks_available: "No tasks available to complete",
	},
	// Added list translations for EmployeesListClient
	list: {
		searchPlaceholder: "Search by name or email...",
		emptyState: "No employees found.",
	},
} as const;
