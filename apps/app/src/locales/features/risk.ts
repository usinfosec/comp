export const risk = {
  risks: "risks",
  overview: "Overview",
  create: "Create New Risk",
  vendor: {
    title: "Vendor Management",
    dashboard: {
      title: "Vendor Dashboard",
      overview: "Vendor Overview",
      vendor_status: "Vendor Status",
      vendor_category: "Vendor Categories",
      inherent_risk_description:
        "Initial risk level before any controls are applied",
      residual_risk_description:
        "Remaining risk level after controls are applied",
    },
    register: {
      title: "Vendor Register",
      table: {
        name: "Name",
        category: "Category",
        status: "Status",
        owner: "Owner",
      },
    },
    assessment: {
      title: "Vendor Assessment",
      inherent_risk: "Inherent Risk",
      residual_risk: "Residual Risk",
    },
    form: {
      vendor_details: "Vendor Details",
      vendor_name: "Name",
      vendor_name_placeholder: "Enter vendor name",
      vendor_website: "Website",
      vendor_website_placeholder: "Enter vendor website",
      vendor_description: "Description",
      vendor_description_placeholder: "Enter vendor description",
      vendor_category: "Category",
      vendor_category_placeholder: "Select category",
      vendor_status: "Status",
      vendor_status_placeholder: "Select status",
      create_vendor_success: "Vendor created successfully",
      create_vendor_error: "Failed to create vendor",
    },
    table: {
      name: "Name",
      category: "Category",
      status: "Status",
      owner: "Owner",
    },
    filters: {
      search_placeholder: "Search vendors...",
      status_placeholder: "Filter by status",
    },
    empty_states: {
      no_vendors: {
        title: "No vendors yet",
        description: "Get started by creating your first vendor",
      },
      no_results: {
        title: "No results found",
        description: "No vendors match your search",
        description_with_filters: "Try adjusting your filters",
      },
    },
    actions: {
      create: "Create Vendor",
    },
    status: {
      not_assessed: "Not Assessed",
      in_progress: "In Progress",
    },
    risk_level: {
      low: "Low Risk",
      medium: "Medium Risk",
      high: "High Risk",
    },
    tasks: {
      empty: {
        no_results: "No results found",
        no_results_description: "Try adjusting your search or filters",
        clear_filters: "Clear filters",
        no_tasks: "No tasks found",
      },
      filters: {
        search: "Search tasks...",
        status: "Filter by status",
        all_statuses: "All statuses",
        not_started: "Not started",
        in_progress: "In progress",
        completed: "Completed",
        assignee: "Filter by assignee",
        all_assignees: "All assignees",
        clear: "Clear filters"
      }
    },
  },
} as const