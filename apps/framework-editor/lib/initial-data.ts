import { Frequency, Departments } from "./types"

export const initialData = {
  frameworks: {
    soc2: {
      name: "SOC 2",
      version: "2025",
      description: "SOC 2 is a framework for assessing the security and reliability of information systems.",
    },
  },
  requirements: {
    soc2: {
      CC1: {
        name: "CC1: Control Environment",
        description:
          "This criterion ensures that the organization demonstrates commitment to integrity and ethical values, establishes board oversight, creates appropriate organizational structures, and shows commitment to competence.",
      },
      CC2: {
        name: "CC2: Communication and Information",
        description:
          "This criterion focuses on how the organization obtains and uses relevant quality information to support the functioning of internal control, and communicates internal control information internally and externally.",
      },
      CC3: {
        name: "CC3: Risk Assessment",
        description:
          "This criterion evaluates how the organization specifies suitable objectives, identifies and analyzes risk, and assesses fraud risk and significant change that could impact the system of internal control.",
      },
    },
  },
  controls: [
    {
      id: "access_authentication",
      name: "Access Authentication",
      description:
        "Prior to issuing system credentials and granting system access, the organization registers and authorizes new internal and external users.",
      mappedArtifacts: [
        {
          type: "policy",
          policyId: "access_control_policy",
        },
      ],
      mappedTasks: [
        {
          taskId: "authentication_records",
        },
      ],
      mappedRequirements: [
        {
          frameworkId: "soc2",
          requirementId: "CC6",
        },
      ],
    },
  ],
  policies: {
    access_control_policy: {
      type: "doc" as const,
      metadata: {
        id: "access_control",
        slug: "access-control-policy",
        name: "Access Control Policy",
        description:
          "This policy defines the requirements for granting, monitoring, and revoking access to the organization's information systems and data based on the principle of least privilege.",
        frequency: Frequency.yearly,
        department: Departments.it,
      },
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Access Control Policy" }],
        },
      ],
    },
  },
  tasks: {
    access_logs: {
      id: "access_logs",
      name: "Access Logs",
      description: "System and application access logs showing user authentication and authorization activities.",
      frequency: Frequency.monthly,
      department: Departments.it,
    },
  },
  videos: [
    {
      id: "sat-1",
      title: "Security Awareness Training - Part 1",
      description: "Security Awareness Training - Part 1",
      youtubeId: "N-sBS3uCWB4",
      url: "https://www.youtube.com/watch?v=N-sBS3uCWB4",
    },
  ],
}
