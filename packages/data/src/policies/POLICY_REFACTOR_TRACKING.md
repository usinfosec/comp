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
- [ ] `classification.json`
- [ ] `code_of_conduct.json`
- [ ] `confidentiality.json`
- [ ] `corporate_governance.json`
- [ ] `cyber_risk.json`
- [ ] `data_center.json`
- [ ] `data_classification.json`
- [ ] `disaster_recovery.json`
- [ ] `human_resources.json`
- [ ] `incident_response.json`
- [ ] `information_security.json`
- [ ] `password_policy.json`
- [ ] `privacy.json`
- [ ] `risk_assessment.json`
- [ ] `risk_management.json`
- [ ] `software_development.json`
- [ ] `system_change.json`
- [ ] `thirdparty.json`
- [ ] `vendor_risk_management.json`
- [ ] `workstation.json` 