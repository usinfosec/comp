export const vendors = {
  title: "Vendors",
  dashboard: {
    title: "Overview",
    by_category: "Vendors by Category",
    status: "Vendor Status"
  },
  register: {
    title: "Vendor Register",
    create_new: "Create Vendor",
  },
  create: "Create Vendor",
  vendor_comments: "Vendor Comments",
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
  tasks: {
    title: "Tasks",
    columns: {
      title: "Title",
      description: "Description",
      status: "Status",
      due_date: "Due Date",
      owner: "Owner"
    },
    filters: {
      search: "Search tasks...",
      status: "Filter by status",
      assignee: "Filter by assignee",
      all_statuses: "All Statuses",
      not_started: "Not Started",
      in_progress: "In Progress",
      completed: "Completed",
      all_assignees: "All Assignees",
      clear: "Clear filters"
    },
    empty: {
      no_results: "No Results Found",
      no_results_description: "No tasks match your current filters",
      clear_filters: "Clear Filters",
      no_tasks: "No Tasks Available",
      no_tasks_description: "There are currently no tasks for this vendor"
    }
  },
  actions: {
    create: "Create Vendor",
  },
  status: {
    not_assessed: "Not Assessed",
    in_progress: "In Progress",
  },
} as const 