// Create any missing organization evidence records
const missingEvidenceRecords = [];

// First check for existing records to avoid duplicates
const existingEvidenceIds = new Set(organizationEvidences.map(e => e.evidenceId));

for (const requirement of controlRequirements) {
  if (
    requirement.type === "evidence" &&
    requirement.evidenceId &&
    requirement.evidence &&
    !existingEvidenceIds.has(requirement.evidenceId)
  ) {
    missingEvidenceRecords.push({
 