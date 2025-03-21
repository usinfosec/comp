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
      vendors_by_assignee: "Vendors by Assignee",
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
      update_success: "Vendor risk assessment updated successfully",
      update_error: "Failed to update vendor risk assessment",
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
      update_vendor: "Update Vendor",
      update_vendor_success: "Vendor updated successfully",
      update_vendor_error: "Failed to update vendor",
      add_comment: "Add Comment",
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
      category_placeholder: "Filter by category",
      owner_placeholder: "Filter by owner",
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
      assessed: "Assessed",
    },
    category: {
      cloud: "Cloud",
      infrastructure: "Infrastructure",
      software_as_a_service: "Software as a Service",
      finance: "Finance",
      marketing: "Marketing",
      sales: "Sales",
      hr: "HR",
      other: "Other",
    },
    risk_level: {
      low: "Low Risk",
      medium: "Medium Risk",
      high: "High Risk",
      unknown: "Unknown Risk",
    },
    tasks: {
      empty: {
        no_results: "No results found",
        no_results_description: "Try adjusting your search or filters",
        clear_filters: "Clear filters",
        no_tasks: "No tasks found",
        no_tasks_description: "Create a task to get started"
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
  dashboard: {
    title: "Dashboard",
    overview: "Risk Overview",
    risk_status: "Risk Status",
    risks_by_department: "Risks by Department",
    risks_by_assignee: "Risks by Assignee",
    inherent_risk_description:
      "Inherent risk is calculated as likelihood * impact. Calculated before any controls are applied.",
    residual_risk_description:
      "Residual risk is calculated as likelihood * impact. This is the risk level after controls are applied.",
    risk_assessment_description: "Compare inherent and residual risk levels",
    by_department: "Risks by Department",
    status: "Risk Status"
  },
  register: {
    title: "Risk Register",
    table: {
      risk: "Risk",
    },
    empty: {
      no_risks: {
        title: "Create a risk to get started",
        description:
          "Track and score risks, create and assign mitigation tasks for your team, and manage your risk register all in one simple interface.",
      },
      create_risk: "Create a risk",
    },
  },
  metrics: {
    probability: "Probability",
    impact: "Impact",
    inherentRisk: "Inherent Risk",
    residualRisk: "Residual Risk",
  },
  form: {
    update_inherent_risk: "Save Inherent Risk",
    update_inherent_risk_description:
      "Update the inherent risk of the risk. This is the risk level before any controls are applied.",
    update_inherent_risk_success: "Inherent risk updated successfully",
    update_inherent_risk_error: "Failed to update inherent risk",
    update_residual_risk: "Save Residual Risk",
    update_residual_risk_description:
      "Update the residual risk of the risk. This is the risk level after controls are applied.",
    update_residual_risk_success: "Residual risk updated successfully",
    update_residual_risk_error: "Failed to update residual risk",
    update_risk: "Update Risk",
    update_risk_description: "Update the risk title or description.",
    update_risk_success: "Risk updated successfully",
    update_risk_error: "Failed to update risk",
    create_risk_success: "Risk created successfully",
    create_risk_error: "Failed to create risk",
    risk_details: "Risk Details",
    risk_title: "Risk Title",
    risk_title_description: "Enter a name for the risk",
    risk_description: "Description",
    risk_description_description: "Enter a description for the risk",
    risk_category: "Category",
    risk_category_placeholder: "Select a category",
    risk_department: "Department",
    risk_department_placeholder: "Select a department",
    risk_status: "Risk Status",
    risk_status_placeholder: "Select a risk status",
  },
  tasks: {
    title: "Tasks",
    attachments: "Attachments",
    overview: "Task Overview",
    form: {
      title: "Task Details",
      task_title: "Task Title",
      status: "Task Status",
      status_placeholder: "Select a task status",
      task_title_description: "Enter a name for the task",
      description: "Description",
      description_description: "Enter a description for the task",
      due_date: "Due Date",
      due_date_description: "Select the due date for the task",
      success: "Task created successfully",
      error: "Failed to create task",
    },
    sheet: {
      title: "Create Task",
      update: "Update Task",
      update_description: "Update the task title or description.",
    },
    empty: {
      description_create:
        "Create a mitigation task for this risk, add a treatment plan, and assign it to a team member.",
    },
  },
} as const 