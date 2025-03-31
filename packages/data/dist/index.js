"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  accessControlPolicy: () => accessControlPolicy,
  applicationSecurityPolicy: () => applicationSecurityPolicy,
  availabilityPolicy: () => availabilityPolicy,
  businessContinuityPolicy: () => businessContinuityPolicy,
  changeManagementPolicy: () => changeManagementPolicy,
  classificationPolicy: () => classificationPolicy,
  codeOfConductPolicy: () => codeOfConductPolicy,
  confidentialityPolicy: () => confidentialityPolicy,
  corporateGovernancePolicy: () => corporateGovernancePolicy,
  cyberRiskPolicy: () => cyberRiskPolicy,
  dataCenterPolicy: () => dataCenterPolicy,
  dataClassificationPolicy: () => dataClassificationPolicy,
  disasterRecoveryPolicy: () => disasterRecoveryPolicy,
  frameworks: () => frameworks,
  humanResourcesPolicy: () => humanResourcesPolicy,
  incidentResponsePolicy: () => incidentResponsePolicy,
  informationSecurityPolicy: () => informationSecurityPolicy,
  passwordPolicy: () => passwordPolicy,
  privacyPolicy: () => privacyPolicy,
  riskAssessmentPolicy: () => riskAssessmentPolicy,
  riskManagementPolicy: () => riskManagementPolicy,
  softwareDevelopmentPolicy: () => softwareDevelopmentPolicy,
  systemChangePolicy: () => systemChangePolicy,
  thirdPartyPolicy: () => thirdPartyPolicy,
  trainingVideos: () => trainingVideos,
  vendorRiskManagementPolicy: () => vendorRiskManagementPolicy,
  workstationPolicy: () => workstationPolicy
});
module.exports = __toCommonJS(index_exports);

// src/videos/trainingVideos.ts
var trainingVideos = [
  {
    id: "sat-1",
    title: "Security Awareness Training - Part 1",
    description: "Security Awareness Training - Part 1",
    youtubeId: "N-sBS3uCWB4",
    url: "https://www.youtube.com/watch?v=N-sBS3uCWB4"
  },
  {
    id: "sat-2",
    title: "Security Awareness Training - Part 2",
    description: "Security Awareness Training - Part 2",
    youtubeId: "JwQNwhDyXig",
    url: "https://www.youtube.com/watch?v=JwQNwhDyXig"
  },
  {
    id: "sat-3",
    title: "Security Awareness Training - Part 3",
    description: "Security Awareness Training - Part 3",
    youtubeId: "fzMNw_-KEGE",
    url: "https://www.youtube.com/watch?v=fzMNw_-KEGE"
  },
  {
    id: "sat-4",
    title: "Security Awareness Training - Part 4",
    description: "Security Awareness Training - Part 4",
    youtubeId: "WbpqjH9kI2Y",
    url: "https://www.youtube.com/watch?v=WbpqjH9kI2Y"
  },
  {
    id: "sat-5",
    title: "Security Awareness Training - Part 5",
    description: "Security Awareness Training - Part 5",
    youtubeId: "Clvfkm6azDs",
    url: "https://www.youtube.com/watch?v=Clvfkm6azDs"
  }
];

// src/frameworks/frameworks.ts
var frameworks = {
  soc2: {
    name: "SOC 2",
    version: "2025",
    description: "SOC 2 is a framework for assessing the security and reliability of information systems."
  },
  iso27001: {
    name: "ISO 27001",
    version: "2025",
    description: "ISO 27001 is a framework for assessing the security and reliability of information systems."
  },
  gdpr: {
    name: "GDPR",
    version: "2025",
    description: "GDPR is a framework for assessing the security and reliability of information systems."
  }
};

// src/policies/data/access-control.policy.ts
var accessControlPolicy = {
  type: "doc",
  metadata: {
    id: "access_control",
    slug: "access-control-policy",
    name: "Access Control Policy",
    description: "This policy defines the requirements for granting, monitoring, and revoking access to the organization's information systems and data based on the principle of least privilege.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC6.1", "CC6.2", "CC6.3", "CC6.4", "CC6.5", "CC6.6"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Access Control Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "CISO" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Restricted" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy governs access to all organizational systems and data. It is designed to enforce the principle of least privilege and protect sensitive information from unauthorized access."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Access rights must be granted based on business need and reviewed periodically."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "User authentication must incorporate strong passwords and multi-factor authentication."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Access privileges must be promptly revoked upon termination or role change."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    }
  ]
};

// src/policies/data/application-security.policy.ts
var applicationSecurityPolicy = {
  type: "doc",
  metadata: {
    id: "application_security",
    slug: "application-security-policy",
    name: "Application Security Policy",
    description: "This policy outlines the security framework and requirements for applications, notably web applications, within the organization's production environment.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC7.1", "CC7.2", "CC7.4"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Application Security Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This application security policy defines the security framework and requirements for applications, notably web applications, within the organization's production environment."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This document also provides implementing controls and instructions for web application security, to include periodic vulnerability scans and other types of evaluations and assessments."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all applications within the organization's production environment, as well as administrators and users of these applications. This typically includes employees and contractors."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Background" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Application vulnerabilities typically account for the largest number of initial attack vectors after malware infections. As a result, it is important that applications are designed with security in mind, and that they are scanned and continuously monitored for malicious activity that could indicate a system compromise. Discovery and subsequent mitigation of application vulnerabilities will limit the organization's attack surface, and ensures a baseline level of security across all systems."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "In addition to scanning guidance, this policy also defines technical requirements and procedures to ensure that applications are properly hardened in accordance with security best practices."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Data Classification Policy" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "OWASP Risk Rating Methodology" }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "OWASP Testing Guide" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "OWASP Top Ten Project" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Security Best Practices" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The organization must ensure that all applications it develops and/or acquires are securely configured and managed. The following security best practices must be considered and, if feasible, applied as a matter of the application's security design:"
        }
      ]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Data handled and managed by the application must be classified in accordance with the Data Classification Policy."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "If the application processes confidential information, a confidential record banner must be prominently displayed which highlights the type of confidential data being accessed (e.g., personally-identifiable information (PII), protected health information (PHI), etc.)"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Third-Party Applications" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "When applications are acquired from a third party, such as a vendor:"
        }
      ]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Only applications that are supported by an approved vendor shall be procured and used."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Full support contracts must be arranged with the application vendor for full life-cycle support."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Web Application Assessment" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Web applications must be assessed according to the following criteria:"
        }
      ]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "New or major application releases must have a full assessment prior to approval of the change control documentation and/or release into the production environment."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Vulnerability Risk Levels" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Vulnerabilities discovered during application assessments must be mitigated based upon the following risk levels, which are based on the Open Web Application Security Project (OWASP) Risk Rating Methodology:"
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 4 },
      content: [{ type: "text", text: "High Risk" }]
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Issues must be fixed immediately" }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Alternate mitigation strategies must be implemented to limit exposure before deployment"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Security Assessment Types" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The following security assessment types may be leveraged to perform an application security assessment:"
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 4 },
      content: [{ type: "text", text: "Full Assessment" }]
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Comprised of tests for all known web application vulnerabilities"
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Uses both automated and manual tools based on the OWASP Testing Guide"
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Must leverage manual penetration testing techniques"
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Validates discovered vulnerabilities to determine overall risk"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 4 },
      content: [{ type: "text", text: "Quick Assessment" }]
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Consists of an automated scan of an application"
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Covers, at minimum, the OWASP Top Ten web application security risks"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 4 },
      content: [{ type: "text", text: "Targeted Assessment" }]
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Verifies vulnerability remediation changes"
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Validates new application functionality"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Additional Security Controls" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "To counter the risk of unauthorized access, the organization maintains a Data Center Security Policy."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Security requirements for the software development life cycle, including system development, acquisition and maintenance are defined in the Software Development Lifecycle Policy."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Security requirements for handling information security incidents are defined in the Security Incident Response Policy."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Disaster recovery and business continuity management policy is defined in the Disaster Recovery Policy."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Requirements for information system availability and redundancy are defined in the System Availability Policy."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/availability.policy.ts
var availabilityPolicy = {
  type: "doc",
  metadata: {
    id: "availability",
    slug: "availability-policy",
    name: "Availability Policy",
    description: "This policy outlines the requirements for proper controls to protect the availability of the organization's information systems.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC9.1", "CC7.3", "CC7.5", "A1.1", "A1.2"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Availability Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Revision History" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Version" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Date" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Description" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "1.0" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Initial document" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The purpose of this policy is to define requirements for proper controls to protect the availability of the organization's information systems."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: 'This policy applies to all users of information systems within the organization. This typically includes employees and contractors, as well as any external parties that come into contact with systems and information controlled by the organization (hereinafter referred to as "users"). This policy must be made readily available to all users.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Background" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The intent of this policy is to minimize the amount of unexpected or unplanned downtime (also known as outages) of information systems under the organization's control. This policy prescribes specific measures for the organization that will increase system redundancy, introduce failover mechanisms, and implement monitoring such that outages are prevented as much as possible. Where they cannot be prevented, outages will be quickly detected and remediated."
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Within this policy, availability is defined as a characteristic of information or information systems in which such information or systems can be accessed by authorized entities whenever needed."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Risk Assessment Policy" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "System Availability Requirements" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Information systems must be consistently available to conduct and support business operations."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Information systems must have a defined availability classification, with appropriate controls enabled and incorporated into development and production processes based on this classification."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "System and network failures must be reported promptly to the organization's lead for Information Technology (IT) or designated IT operations manager."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Users must be notified of scheduled outages (e.g., system maintenance) that require periods of downtime. This notification must specify the date and time of the system maintenance, expected duration, and anticipated system or service resumption time."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Prior to production use, each new or significantly modified application must have a completed risk assessment that includes availability risks. Risk assessments must be completed in accordance with the Risk Assessment Policy."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Capacity management and load balancing techniques must be used, as deemed necessary, to help minimize the risk and impact of system failures."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Backup Requirements" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Information systems must have an appropriate data backup plan that ensures:"
        }
      ]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All sensitive data can be restored within a reasonable time period."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Full backups of critical resources are performed on at least a weekly basis."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Incremental backups for critical resources are performed on at least a daily basis."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Backups and associated media are maintained for a minimum of thirty (30) days and retained for at least one (1) year, or in accordance with legal and regulatory requirements."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Backups are stored off-site with multiple points of redundancy and protected using encryption and key management."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Tests of backup data must be conducted once per quarter. Tests of configurations must be conducted twice per year."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Redundancy and Failover" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Information systems must have an appropriate redundancy and failover plan that meets the following criteria:"
        }
      ]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Network infrastructure that supports critical resources must have system-level redundancy (including but not limited to a secondary power supply, backup disk-array, and secondary computing system)."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Critical core components must have an actively maintained spare. SLAs must require parts replacement within twenty-four (24) hours."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Servers that support critical resources must have redundant power supplies and network interface cards."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Servers classified as high availability must use disk mirroring."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Business Continuity" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Information systems must have an appropriate business continuity plan that adheres to the following availability classifications and requirements:"
        }
      ]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Availability Classification" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Availability Requirements" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Scheduled Outage" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Recovery Time" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Data Loss or Impact Loss" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "High" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "High to Continuous" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "30 minutes" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "1 hour" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Minimal" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Medium" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Standard Availability" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "2 hours" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "4 hours" }]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Some data loss is tolerated if it results in quicker restoration"
                }
              ]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Low" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Limited Availability" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "4 hours" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Next business day" }]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Some data loss is tolerated if it results in quicker restoration"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The business continuity plan must also ensure:"
        }
      ]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Recovery time requirements and data loss limits must be adhered to with specific documentation in the plan."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Company and/or external critical resources, personnel, and necessary corrective actions must be specifically identified."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Specific responsibilities and tasks for responding to emergencies and resuming business operations must be included in the plan."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All applicable legal and regulatory requirements must be satisfied."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Requirements for information system availability and redundancy are defined in the System Availability Policy."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/business-continuity.policy.ts
var businessContinuityPolicy = {
  type: "doc",
  metadata: {
    id: "business_continuity",
    slug: "business-continuity-dr-policy",
    name: "Business Continuity & Disaster Recovery Policy",
    description: "This policy outlines the strategies and procedures for ensuring the availability of critical systems and data during and after a disruptive event.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC7.3", "A1.3", "CC9.1", "CC9.9"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [
        {
          type: "text",
          text: "Business Continuity & Disaster Recovery Policy"
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "IT & Business Continuity Committee" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy provides guidelines and procedures to ensure the continuous operation of critical business processes and the rapid recovery of IT systems following a disruptive event."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Identify critical business functions and define Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Develop, maintain, and test business continuity and disaster recovery plans."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Ensure backup systems, data redundancy, and failover mechanisms are in place."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    }
  ]
};

// src/policies/data/change-management.policy.ts
var changeManagementPolicy = {
  type: "doc",
  metadata: {
    id: "change_management",
    slug: "change-management-policy",
    name: "Change Management Policy",
    description: "This policy defines the process for requesting, reviewing, approving, and documenting changes to the organization's information systems and infrastructure.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC3.4", "CC8.1", "CC6.7"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Change Management Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "IT Management" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Restricted" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy outlines the process for managing changes to systems and infrastructure, ensuring all modifications are reviewed, approved, tested, and documented."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All change requests must be submitted via the designated change management system."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Changes must be reviewed and approved by the Change Advisory Board (CAB) before implementation, except for approved emergency changes."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Post-implementation reviews must be conducted to ensure changes did not negatively impact operations."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    }
  ]
};

// src/policies/data/classification.policy.ts
var classificationPolicy = {
  type: "doc",
  metadata: {
    id: "data_classification",
    slug: "data-classification-policy",
    name: "Data Classification Policy",
    description: "This policy outlines the requirements for data classification.",
    frequency: "yearly",
    department: "gov",
    usedBy: {
      soc2: ["CC6.1", "CC8.1", "CC6.6"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Data Classification Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This data classification policy defines the requirements to ensure that information within the organization is protected at an appropriate level."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This document applies to the entire scope of the organization's information security program. It includes all types of information, regardless of its form, such as paper or electronic documents, applications and databases, and knowledge or information that is not written."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all individuals and systems that have access to information kept by the organization."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Background" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy defines the high level objectives and implementation instructions for the organization's data classification scheme. This includes data classification levels, as well as procedures for the classification, labeling and handling of data within the organization. Confidentiality and non-disclosure agreements maintained by the organization must reference this policy."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Classification Levels" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Confidentiality Level"
                    }
                  ]
                }
              ]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Label"
                    }
                  ]
                }
              ]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Classification Criteria"
                    }
                  ]
                }
              ]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Access Restrictions"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Public" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "For Public Release" }]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Making the information public will not harm the organization in any way."
                }
              ]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Information is available to the public."
                }
              ]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Internal Use" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Internal Use" }]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Unauthorized access may cause minor damage and/or inconvenience to the organization."
                }
              ]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Information is available to all employees and authorized third parties."
                }
              ]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Restricted" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Restricted" }]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Unauthorized access to information may cause considerable damage to the business and/or the organization's reputation."
                }
              ]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Information is available to a specific group of employees and authorized third parties."
                }
              ]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Unauthorized access to information may cause catastrophic damage to business and/or the organization's reputation."
                }
              ]
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "text",
                  text: "Information is available only to specific individuals in the organization."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "If classified information is received from outside the organization, the person who receives the information must classify it in accordance with the rules prescribed in this policy. The person thereby will become the owner of the information."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "If classified information is received from outside the organization and handled as part of business operations activities (e.g., customer data on provided cloud services), the information classification, as well as the owner of such information, must be made in accordance with the specifications of the respective customer service agreement and other legal requirements."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "When classifying information, the level of confidentiality is determined by:"
                }
              ]
            },
            {
              type: "orderedList",
              attrs: { tight: true, start: 1 },
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: " Value" },
                        { type: "text", text: ": " },
                        {
                          type: "text",
                          text: "The value of the information, based on impacts identified during the risk assessment process."
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: " Sensitivity" },
                        { type: "text", text: ": " },
                        {
                          type: "text",
                          text: "Sensitivity and criticality of the information, based on the highest risk calculated for each information item during the risk assessment."
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: " Legal obligations" },
                        { type: "text", text: ": " },
                        {
                          type: "text",
                          text: "Legal, regulatory and contractual obligations."
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Appendices" }]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [
        {
          type: "text",
          text: "Appendix A: Handling of Classified Information"
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Information and information systems must be handled according to detailed guidelines covering:"
        }
      ]
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Paper Documents" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Electronic Documents" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Information Systems" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Electronic Mail" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Electronic Storage Media" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Information Transmitted Orally" }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/code-of-conduct.policy.ts
var codeOfConductPolicy = {
  type: "doc",
  metadata: {
    id: "code_of_conduct",
    slug: "code-of-conduct",
    name: "Code of Conduct Policy",
    description: "This policy outlines the expected behavior from employees towards their colleagues, supervisors, and the organization as a whole.",
    frequency: "yearly",
    department: "hr",
    usedBy: {
      soc2: ["CC1.1", "CC6.1"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Code of Conduct Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Human Resources" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The purpose of this policy is to define expected behavior from employees towards their colleagues, supervisors, and the organization as a whole."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All employees and contractors must follow this policy as outlined in their Employment Offer Letter or Independent Contractor Agreement while performing their duties."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Compliance with Law: Employees must understand and comply with environmental, safety, and fair dealing laws while ensuring ethical and responsible conduct in their job duties."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Respect in the Workplace: Discriminatory behavior, harassment, or victimization is strictly prohibited."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Protection of Company Property: Employees must not misuse company equipment, respect intellectual property, and protect material property from damage."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Personal Appearance: Employees must present themselves in a professional manner and adhere to the company dress code."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Corruption: Employees must not accept bribes or inappropriate gifts from clients or partners."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Job Duties and Authority: Employees must act with integrity, respect team members, and avoid abuse of authority when delegating responsibilities."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Absenteeism and Tardiness: Employees must adhere to their designated work schedules unless exceptions are approved by their hiring manager."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Conflict of Interest: Employees must avoid personal or financial interests that interfere with their job duties."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Collaboration: Employees must promote a positive and cooperative work environment."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Communication: Employees must maintain open and professional communication with colleagues and supervisors."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Benefits: Employees must not abuse employment benefits, such as time off, insurance, or company resources."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Policy Adherence: Employees must comply with all company policies. Questions should be directed to HR or their hiring manager."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Disciplinary Actions" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Violations of this policy may result in disciplinary actions, including but not limited to:"
                }
              ]
            },
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [{ type: "text", text: "Demotion" }]
                },
                {
                  type: "listItem",
                  content: [{ type: "text", text: "Reprimand" }]
                },
                {
                  type: "listItem",
                  content: [
                    { type: "text", text: "Suspension or termination" }
                  ]
                },
                {
                  type: "listItem",
                  content: [{ type: "text", text: "Reduction of benefits" }]
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Serious violations such as corruption, theft, or embezzlement may result in legal action."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/confidentiality.policy.ts
var confidentialityPolicy = {
  type: "doc",
  metadata: {
    id: "confidentiality",
    slug: "confidentiality",
    name: "Confidentiality Policy",
    description: "This policy outlines the requirements for maintaining the confidentiality of sensitive and proprietary information within the organization.",
    frequency: "yearly",
    department: "gov",
    usedBy: {
      soc2: ["CC9.9", "CC6.1"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Confidentiality Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The purpose of this policy is to define guidelines for maintaining the confidentiality of sensitive and proprietary information within the organization."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all employees, contractors, third-party vendors, and other individuals who access confidential information belonging to the organization."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Confidential information includes, but is not limited to, customer data, trade secrets, intellectual property, financial records, employee records, and other sensitive organizational data."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Confidential Information Handling" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Confidential information must be accessed only by authorized individuals with a legitimate business need."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Confidential data must be encrypted at rest and in transit to prevent unauthorized access."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Employees must use company-approved systems and communication channels for handling confidential data."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Unauthorized disclosure, duplication, or transmission of confidential data is strictly prohibited."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Non-Disclosure Agreements (NDAs)" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All employees, contractors, and third-party vendors must sign a Non-Disclosure Agreement (NDA) before accessing confidential information."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "NDAs outline obligations to protect and prevent the unauthorized use or disclosure of confidential information."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Violations of an NDA may result in disciplinary action, contract termination, and potential legal consequences."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Access Control Measures" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Access to confidential information is based on the principle of least privilege (PoLP)."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Users must authenticate via company-approved methods (e.g., Multi-Factor Authentication) before accessing confidential data."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Confidential data must not be stored on personal devices unless explicitly authorized."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Incident Reporting and Enforcement" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Employees must report any suspected or actual breaches of confidentiality to the Information Security Manager (ISM) immediately."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Violations of this policy may result in disciplinary actions, including termination of employment or legal action."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/corporate-governance.policy.ts
var corporateGovernancePolicy = {
  type: "doc",
  metadata: {
    id: "corporate_governance",
    slug: "corporate-governance-policy",
    name: "Corporate Governance Policy",
    description: "This policy defines the overall governance framework including board oversight, management responsibilities, and organizational structure to ensure effective oversight and accountability.",
    frequency: "yearly",
    department: "admin",
    usedBy: {
      soc2: ["CC1.1", "CC1.2", "CC1.5", "CC2.2", "CC2.3"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Corporate Governance Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Board of Directors" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Revision History" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Version" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Date" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Description" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "1.0" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Initial version" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy provides a framework for effective governance by outlining the responsibilities of the board, senior management, and related committees. It applies to all members of the board and senior leadership."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [
        {
          type: "text",
          text: "Board Oversight and Management Responsibilities"
        }
      ]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Ensure the board maintains independence from management."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Review and approve internal control frameworks and risk management reports regularly."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Establish committees and processes for oversight of key business functions."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Review and update this policy at least annually."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Risk Management Policy" }]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/cyber-risk.policy.ts
var cyberRiskPolicy = {
  type: "doc",
  metadata: {
    id: "cyber_risk",
    slug: "cyber-risk",
    name: "Cyber Risk Assessment Policy",
    description: "This policy outlines the requirements for conducting cyber risk assessments to identify, evaluate, and mitigate cybersecurity threats to the organization.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC1.1", "CC1.2", "CC1.3", "CC1.4", "CC1.5"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Cyber Risk Assessment Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The purpose of this policy is to establish a structured approach for conducting cyber risk assessments to identify, evaluate, and mitigate cybersecurity threats to the organization."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all employees, contractors, and third parties responsible for cybersecurity risk management within the organization."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Cyber risk assessments must be conducted on all critical systems, networks, and applications to ensure compliance with security policies and regulatory requirements."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Cyber Risk Assessment Process" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The organization must establish a cyber risk assessment methodology that includes identifying assets, assessing threats, evaluating vulnerabilities, and determining potential impact."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All risks must be documented in a cyber risk register and categorized based on severity and business impact."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Cyber risk assessments must be conducted at least annually and whenever significant changes to the IT infrastructure or threat landscape occur."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Identified risks must be assigned an owner responsible for implementing appropriate mitigation measures."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Cyber Risk Mitigation Strategies" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The organization must implement cyber risk mitigation strategies based on the severity of identified risks, including risk avoidance, acceptance, transfer, or reduction."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Cybersecurity controls such as firewalls, encryption, endpoint protection, and access controls must be implemented to reduce risk to an acceptable level."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Cyber risk treatment plans must be reviewed periodically to ensure their continued effectiveness."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Reporting and Compliance" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Cyber risk assessment results must be reported to senior management and cybersecurity stakeholders for informed decision-making."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The organization must comply with industry standards, regulations, and best practices for cybersecurity risk management."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Cyber risk assessments must be updated periodically to adapt to evolving cyber threats and business changes."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Non-compliance with this policy may result in corrective actions, including enhanced security controls, additional training, or disciplinary measures."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/data-center.policy.ts
var dataCenterPolicy = {
  type: "doc",
  metadata: {
    id: "data_center",
    slug: "data-center",
    name: "Data Center Policy",
    description: "This policy outlines the requirements for the organization's data center facilities to ensure protection, availability, and reliability of critical systems and data.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC6.1", "CC6.2", "CC8.1", "CC7.1"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Datacenter Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The purpose of this policy is to define security and operational requirements for the organization's datacenter facilities to ensure protection, availability, and reliability of critical systems and data."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all employees, contractors, vendors, and third-party service providers who access or maintain datacenter infrastructure."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All datacenter locations, including on-premises, colocation, and cloud facilities that host the organization's critical IT infrastructure, fall under this policy's scope."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Datacenter Security Requirements" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Datacenters must have physical security controls such as access restrictions, video surveillance, and intrusion detection systems."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Access to the datacenter must be granted only to authorized personnel with a legitimate business need."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Visitor access must be logged, monitored, and restricted to authorized escorts within the facility."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Multi-factor authentication must be required for personnel accessing restricted areas of the datacenter."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Environmental Controls" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Datacenters must have redundant power supplies and backup generators to ensure continuous operation."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Temperature and humidity must be monitored and maintained within manufacturer-recommended ranges for critical equipment."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Fire suppression systems must be in place to protect against damage to IT infrastructure."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Datacenter Access and Auditing" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Access logs must be maintained and reviewed periodically to ensure compliance with access control policies."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Annual security assessments must be conducted to evaluate compliance with datacenter security requirements."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Unauthorized access attempts must be reported immediately to security personnel."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [
        { type: "text", text: "Disaster Recovery and Business Continuity" }
      ]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Datacenter facilities must be included in the organization's Business Continuity and Disaster Recovery plans."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Data backups must be stored securely and regularly tested to ensure data recoverability."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Datacenter failover plans must be documented and tested periodically."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/data-classification.policy.ts
var dataClassificationPolicy = {
  type: "doc",
  metadata: {
    id: "data_classification",
    slug: "data-classification-policy",
    name: "Data Classification Policy",
    description: "This policy establishes a framework for classifying data based on sensitivity and defines handling requirements for each classification level.",
    frequency: "yearly",
    department: "gov",
    usedBy: {
      soc2: ["C1.1", "C1.2", "C1.3"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Data Classification Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "CISO" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Restricted" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy establishes the criteria for classifying data into categories (e.g., Public, Internal, Confidential, Highly Sensitive) and specifies handling requirements for each category."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All data must be classified at the time of creation or receipt."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Classification levels must be defined with corresponding handling, storage, and disposal requirements."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Access to confidential data must be restricted on a need-to-know basis."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    }
  ]
};

// src/policies/data/disaster_recovery.policy.ts
var disasterRecoveryPolicy = {
  type: "doc",
  metadata: {
    id: "disaster_recovery",
    slug: "disaster-recovery-policy",
    name: "Disaster Recovery Policy",
    description: "This policy outlines the requirements for disaster recovery planning to ensure the organization can recover from disruptive events.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC1.1", "CC1.2", "CC1.3", "CC1.4", "CC1.5"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Disaster Recovery Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy establishes the framework for disaster recovery planning to ensure the organization can recover from disruptive events, including natural disasters, cyber incidents, and other emergencies."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "A disaster recovery plan must be developed, documented, and maintained for all critical systems and data."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The disaster recovery plan must include recovery time objectives (RTO) and recovery point objectives (RPO) for each critical system."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Regular testing of the disaster recovery plan must be conducted to ensure its effectiveness and to identify areas for improvement."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All employees must be trained on their roles and responsibilities in the event of a disaster."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Business Continuity Policy" }]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/human_resources.policy.ts
var humanResourcesPolicy = {
  type: "doc",
  metadata: {
    id: "human_resources",
    slug: "human-resources-policy",
    name: "Human Resources Policy",
    description: "This policy outlines the principles and practices for recruitment, employee management, performance evaluations, and the enforcement of internal control responsibilities.",
    frequency: "yearly",
    department: "hr",
    usedBy: {
      soc2: ["CC1.3", "CC1.4"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Human Resources Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "HR Director" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Internal" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy governs all aspects of human resource management including recruitment, performance management, and employee accountability for internal control responsibilities."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Recruitment processes must include background checks and verification of qualifications for roles with access to sensitive information."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Employees must complete training on internal controls and ethical behavior during onboarding and at regular intervals."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Performance evaluations shall include assessments of adherence to internal control responsibilities."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    }
  ]
};

// src/policies/data/incident_response.policy.ts
var incidentResponsePolicy = {
  type: "doc",
  metadata: {
    id: "incident_response",
    slug: "incident-response-policy",
    name: "Incident Response Policy",
    description: "This policy establishes the framework and procedures for detecting, responding to, and recovering from security incidents.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC7.2", "CC7.4", "CC7.5"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Incident Response Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "CISO" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy defines the steps for identifying, reporting, and responding to security incidents to minimize impact and restore normal operations as quickly as possible."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Establish an Incident Response Team (IRT) with defined roles and responsibilities."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Implement processes for incident detection, reporting, containment, eradication, and recovery."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Conduct regular incident response training and simulation exercises."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    }
  ]
};

// src/policies/data/information-security.policy.ts
var informationSecurityPolicy = {
  type: "doc",
  metadata: {
    id: "information_security",
    slug: "information-security-policy",
    name: "Information Security Policy",
    description: "This policy establishes the framework for protecting the organization's information assets by defining security objectives, roles, responsibilities, and controls.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC2.1", "PI1.1", "PI1.2", "PI1.3", "CC5.2"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Information Security Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "CISO" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The purpose of this policy is to protect the confidentiality, integrity, and availability of information assets by establishing security requirements and responsibilities across the organization. This policy applies to all employees, contractors, and third-party service providers."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All information assets shall be classified and handled according to their sensitivity."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Access to information must be restricted based on role and business need."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Security controls such as encryption, firewalls, and intrusion detection systems must be implemented and regularly tested."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Data Classification Policy" }]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/password-policy.policy.ts
var passwordPolicy = {
  type: "doc",
  metadata: {
    id: "password_policy",
    slug: "password-policy",
    name: "Password Policy",
    description: "This policy outlines the requirements for passwords used by employees.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC1.1", "CC1.2", "CC1.3"]
    }
  },
  content: []
};

// src/policies/data/privacy.policy.ts
var privacyPolicy = {
  type: "doc",
  metadata: {
    id: "privacy",
    slug: "privacy-policy",
    name: "Privacy Policy",
    description: "This policy describes how the organization collects, uses, discloses, and protects personal information in compliance with applicable privacy regulations.",
    frequency: "yearly",
    department: "gov",
    usedBy: {
      soc2: ["P1.1", "P1.2", "P1.3"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Privacy Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Privacy Officer" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy outlines the organization's practices for handling personal data, including collection, processing, retention, and disposal, to ensure compliance with privacy regulations."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Obtain explicit consent prior to collecting personal data where required."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Limit the collection of personal data to what is necessary for business purposes."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Ensure personal data is stored securely and only accessible to authorized personnel."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    }
  ]
};

// src/policies/data/risk-assessment.policy.ts
var riskAssessmentPolicy = {
  type: "doc",
  metadata: {
    id: "risk_assessment",
    slug: "risk-assessment",
    name: "Risk Assessment Policy",
    description: "This policy outlines the requirements for conducting risk assessments to identify, evaluate, and mitigate risks associated with the organization's information systems, operations, and assets.",
    frequency: "yearly",
    department: "gov",
    usedBy: {
      soc2: ["CC3.2", "CC3.4", "CC8.1"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Risk Assessment Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The purpose of this policy is to establish a structured approach for identifying, evaluating, and mitigating risks associated with the organization's information systems, operations, and assets."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all employees, contractors, and third parties responsible for assessing and managing risk within the organization."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Risk assessments must be conducted for all business units, departments, and critical systems to ensure compliance with regulatory and security requirements."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Risk Assessment Process" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The organization must establish a formal risk assessment methodology that includes identifying assets, assessing threats, determining vulnerabilities, and evaluating impact and likelihood."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All risks must be documented in a risk register and categorized based on their severity and potential business impact."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Risk assessments must be conducted at least annually and whenever significant changes to systems, processes, or threats occur."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All identified risks must be assigned an owner responsible for implementing appropriate mitigation measures."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Risk Mitigation Strategies" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The organization must implement risk mitigation strategies based on the level of identified risk, including risk avoidance, acceptance, transfer, and reduction."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Controls must be implemented to reduce risk to an acceptable level, including security controls, process improvements, and technical safeguards."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Risk treatment plans must be reviewed periodically to ensure continued effectiveness."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/risk-management.policy.ts
var riskManagementPolicy = {
  type: "doc",
  metadata: {
    id: "risk_management",
    slug: "risk-management-policy",
    name: "Risk Management Policy",
    description: "This policy defines the process for identifying, assessing, and mitigating risks to the organization's objectives and information assets.",
    frequency: "yearly",
    department: "gov",
    usedBy: {
      soc2: ["CC3.1", "CC3.2", "CC3.3", "CC4.2"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Risk Management Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Risk Committee" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy establishes the framework and process for identifying, assessing, and mitigating risks that could impact the organization's objectives. It applies to all business units and processes."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Conduct risk assessments at least annually and whenever significant changes occur."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Document identified risks in a risk register and assign risk owners."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Implement risk mitigation strategies based on the assessed impact and likelihood."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Information Security Policy" }]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/software-development.policy.ts
var softwareDevelopmentPolicy = {
  type: "doc",
  metadata: {
    id: "software_development",
    slug: "software-development",
    name: "Software Development Lifecycle Policy",
    description: "This policy outlines the requirements for the software development lifecycle to ensure secure, reliable, and high-quality software development practices.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC6.2", "CC7.1", "CC7.2", "CC8.1"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [
        {
          type: "text",
          text: "Software Development Lifecycle (SDLC) Policy"
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The purpose of this policy is to define a structured Software Development Lifecycle (SDLC) to ensure secure, reliable, and high-quality software development practices."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all software development teams, including employees, contractors, and third-party developers involved in designing, developing, testing, deploying, and maintaining software for the organization."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The policy covers all software, including internal applications, customer-facing applications, and third-party integrated software solutions."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [
        { type: "text", text: "Software Development Lifecycle Phases" }
      ]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "1. Planning & Requirements:"
                }
              ]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Define business, functional, and security requirements before software development begins. Risk assessments must be conducted to identify security concerns early in the process."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "2. Design & Architecture:"
                }
              ]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Software design must incorporate security principles, including secure authentication, encryption, and least privilege access controls."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "3. Development & Implementation:"
                }
              ]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Developers must adhere to secure coding practices, including input validation, proper error handling, and protection against known vulnerabilities (e.g., OWASP Top Ten threats)."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  marks: [{ type: "bold" }],
                  text: "4. Testing & Validation:"
                }
              ]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All software must undergo security, functional, and performance testing before deployment. Automated and manual security testing must be conducted, including penetration testing and code reviews."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/system-change.policy.ts
var systemChangePolicy = {
  type: "doc",
  metadata: {
    id: "system_change",
    slug: "system-change-policy",
    name: "System Change Policy",
    description: "This policy outlines the requirements for system changes.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC3.4", "CC6.8", "CC7.1", "A1.1"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "System Change Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This information security policy defines how changes to information systems are planned and implemented."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to the entire information security program at the organization (i.e. to all information and communications technology, as well as related documentation)."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All employees, contractors, part-time and temporary workers, service providers, and those employed by others to perform work for the organization, or who have been granted to the organization's information and communications technology, must comply with this policy."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Background" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy defines specific requirements to ensure that changes to systems and applications are properly planned, evaluated, reviewed, approved, communicated, implemented, documented, and reviewed, thereby ensuring the greatest probability of success. Where changes are not successful, this document provides mechanisms for conducting post-implementation review such that future mistakes and errors can be prevented."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All changes to information systems must follow a standardized process that includes planning, testing, approval, and documentation."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/thirdparty.policy.ts
var thirdPartyPolicy = {
  type: "doc",
  metadata: {
    id: "thirdparty",
    slug: "thirdparty",
    name: "Third-Party Management Policy",
    description: "This policy defines the rules for relationships with the organization's Information Technology (IT) third-parties and partners.",
    frequency: "yearly",
    department: "gov",
    usedBy: {
      soc2: ["CC2.3", "CC7.3", "CC8.1"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Third-Party Management Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy defines the rules for relationships with the organization's Information Technology (IT) third-parties and partners."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all IT third-parties and partners who can impact the confidentiality, integrity, and availability of the organization's technology and sensitive information, or who are within the scope of the organization's information security program."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all employees and contractors responsible for the management and oversight of IT third-parties and partners of the organization."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Background" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "The overall security of the organization is highly dependent on the security of its contractual relationships with its IT suppliers and partners. This policy defines requirements for effective management and oversight of such suppliers and partners from an information security perspective. It prescribes minimum security standards third-parties must meet, including security clauses, risk assessments, service level agreements, and incident management."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Information Security Policy" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Security Incident Response Policy" }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "IT third-parties are prohibited from accessing the organization's information security assets until a contract containing security controls is agreed to and signed by the appropriate parties."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All IT third-parties must comply with the security policies defined in the Information Security Policy."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All security incidents involving IT third-parties or partners must be documented per the Security Incident Response Policy and immediately reported to the Information Security Manager (ISM)."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The organization must adhere to the terms of all Service Level Agreements (SLAs) entered into with IT third-parties. As SLAs are updated or new agreements are made, necessary changes or controls must be implemented to maintain compliance."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// src/policies/data/vendor-risk-management.policy.ts
var vendorRiskManagementPolicy = {
  type: "doc",
  metadata: {
    id: "vendor_risk_management",
    slug: "vendor-risk-management-policy",
    name: "Vendor Risk Management Policy",
    description: "This policy outlines the criteria and procedures for evaluating, selecting, and monitoring third-party vendors to manage risks associated with external service providers.",
    frequency: "yearly",
    department: "gov",
    usedBy: {
      soc2: ["CC9.2"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Vendor Risk Management Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Procurement" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Restricted" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This policy establishes guidelines for evaluating and managing risks associated with vendors and third-party service providers."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Conduct risk assessments for all vendors prior to engagement."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Maintain ongoing monitoring and periodic reassessment of vendor risk."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Include appropriate security and compliance requirements in vendor contracts."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    }
  ]
};

// src/policies/data/workstation.policy.ts
var workstationPolicy = {
  type: "doc",
  metadata: {
    id: "workstation",
    slug: "workstation",
    name: "Workstation Policy",
    description: "This policy outlines the requirements for workstations to ensure secure, reliable, and high-quality software development practices.",
    frequency: "yearly",
    department: "it",
    usedBy: {
      soc2: ["CC6.2", "CC6.7", "CC7.2"]
    }
  },
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Workstation Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy Information" }]
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "Organization" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Last Review" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Review Frequency" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Approved By" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Classification" }]
            }
          ]
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{organization}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "{{date}}" }]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Annual" }]
            },
            {
              type: "tableCell",
              content: [
                { type: "text", text: "Chief Information Security Officer" }
              ]
            },
            {
              type: "tableCell",
              content: [{ type: "text", text: "Confidential" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Purpose and Scope" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy defines best practices to reduce the risk of data loss or exposure through workstations."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This policy applies to all employees and contractors using workstations."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Workstations are defined as all company-owned and personal devices containing company data."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Policy" }]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Workstation Device Requirements" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Operating systems must be no more than one generation older than the current version."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Devices must be encrypted at rest to protect company data."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Devices must be locked when not in use or when an employee leaves the workstation."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Workstations must be used for authorized business purposes only."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Loss or destruction of devices must be reported immediately to IT."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Laptops and desktop devices must run the latest version of IT-approved antivirus software."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Desktop & Laptop Devices" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All desktop and laptop devices must be company-owned and managed by IT."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Personal devices are not allowed to access company data or systems."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All devices must have a password-protected screensaver that activates after 5 minutes of inactivity."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Devices must be returned to IT upon termination of employment."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Mobile Devices" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Mobile devices used for business purposes must be enrolled in Mobile Device Management (MDM)."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All mobile devices must have a passcode or biometric authentication enabled."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Mobile devices must be kept up to date with the latest security patches."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Lost or stolen devices must be reported immediately to IT for remote wipe."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Software Installation" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Only IT-approved software may be installed on company devices."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Users must not attempt to bypass security controls or install unauthorized software."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All software must be kept up to date with the latest security patches."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Data Protection" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Sensitive data must be stored in approved locations only."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Data must be backed up regularly using approved backup solutions."
                }
              ]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Users must not store sensitive data on personal devices or cloud storage."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "References" }]
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Information Security Policy" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Data Protection Policy" }]
            }
          ]
        }
      ]
    }
  ]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  accessControlPolicy,
  applicationSecurityPolicy,
  availabilityPolicy,
  businessContinuityPolicy,
  changeManagementPolicy,
  classificationPolicy,
  codeOfConductPolicy,
  confidentialityPolicy,
  corporateGovernancePolicy,
  cyberRiskPolicy,
  dataCenterPolicy,
  dataClassificationPolicy,
  disasterRecoveryPolicy,
  frameworks,
  humanResourcesPolicy,
  incidentResponsePolicy,
  informationSecurityPolicy,
  passwordPolicy,
  privacyPolicy,
  riskAssessmentPolicy,
  riskManagementPolicy,
  softwareDevelopmentPolicy,
  systemChangePolicy,
  thirdPartyPolicy,
  trainingVideos,
  vendorRiskManagementPolicy,
  workstationPolicy
});
