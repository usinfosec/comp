export const people = {
  title: "People",
  details: {
    title: "Employee Details",
    tasks: "Tasks",
  },
  status: {
    active: "Active",
    inactive: "Inactive",
  },
  description: "Manage your team members and their roles.",
  filters: {
    search: "Search people...",
    role: "Filter by role",
  },
  actions: {
    invite: "Add Employee",
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
  invite: {
    title: "Add Employee",
    description: "Add an employee to your organization.",
    email: {
      label: "Email address",
      placeholder: "Enter email address",
    },
    role: {
      label: "Role",
      placeholder: "Select a role",
    },
    name: {
      label: "Name",
      placeholder: "Enter name",
    },
    department: {
      label: "Department",
      placeholder: "Select a department",
    },
    submit: "Add Employee",
    success: "Employee added successfully",
    error: "Failed to add employee",
  },
} as const;
