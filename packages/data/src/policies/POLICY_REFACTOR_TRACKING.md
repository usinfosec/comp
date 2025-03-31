# Policy JSON to TypeScript Refactor Tracking

**Approval:** Gemini has been approved to convert all files listed below sequentially without further prompts. Gemini will stop if an error occurs or when all files are completed.

This file tracks the conversion of policy data from `.json` files to `.ts` files in `packages/data/src/policies/data/`.

The process for each file is:
1. Create a corresponding `.ts` file (e.g., `access-control.policy.ts`).
2. Copy the JSON content into the `.ts` file, exporting it as a `const` typed with the `Policy` interface from `../policies.types`.
3. Delete the original `.json` file.
4. Update this checklist.

## Checklist

- [x] `access_control.json`
- [x] `application_security.json`
- [x] `availability.json`
- [x] `business_continuity.json`
- [x] `change_management.json`
- [x] `classification.json`
- [x] `code_of_conduct.json`
- [x] `confidentiality.json`
- [x] `corporate_governance.json`
- [x] `cyber_risk.json`
- [x] `data_center.json`
- [x] `data_classification.json`
- [x] `disaster_recovery.json`
- [x] `human_resources.json`
- [x] `incident_response.json`
- [x] `information_security.json`
- [x] `password_policy.json`
- [x] `privacy.json`
- [x] `risk_assessment.json`
- [x] `risk_management.json`
- [x] `software_development.json`
- [x] `system_change.json`
- [x] `thirdparty.json`
- [x] `vendor_risk_management.json`
- [x] `workstation.json` 

Do not add more entried to this file, only check these existing entries. If in doubt scan the directory /policies/data to see what JSONS actually exist.