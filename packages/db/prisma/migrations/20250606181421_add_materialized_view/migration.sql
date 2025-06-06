-- Drop the view if it already exists to make this script re-runnable
DROP MATERIALIZED VIEW IF EXISTS "OrganizationStats";

-- Create the materialized view to store organization-level counts
CREATE MATERIALIZED VIEW "OrganizationStats" AS
SELECT
    o.id AS "organizationId",
    o.name AS "organizationName",
    o.slug AS "organizationSlug",
    COUNT(DISTINCT apikey.id) AS "apiKeysCount",
    COUNT(DISTINCT audit.id) AS "auditLogsCount",
    COUNT(DISTINCT ctrl.id) AS "controlsCount",
    COUNT(DISTINCT fi.id) AS "frameworkInstancesCount",
    COUNT(DISTINCT integ.id) AS "integrationsCount",
    COUNT(DISTINCT inv.id) AS "invitationsCount",
    COUNT(DISTINCT mem.id) AS "membersCount",
    COUNT(DISTINCT pol.id) AS "policiesCount",
    COUNT(DISTINCT rsk.id) AS "risksCount",
    COUNT(DISTINCT ven.id) AS "vendorsCount",
    COUNT(DISTINCT tsk.id) AS "tasksCount",
    COUNT(DISTINCT cmt.id) AS "commentsCount",
    COUNT(DISTINCT att.id) AS "attachmentsCount",
    COUNT(DISTINCT trst."organizationId") AS "trustsCount",
    COUNT(DISTINCT ctx.id) AS "contextsCount"
FROM
    "Organization" o
LEFT JOIN "ApiKey" apikey ON o.id = apikey."organizationId"
LEFT JOIN "AuditLog" audit ON o.id = audit."organizationId"
LEFT JOIN "Control" ctrl ON o.id = ctrl."organizationId"
LEFT JOIN "FrameworkInstance" fi ON o.id = fi."organizationId"
LEFT JOIN "Integration" integ ON o.id = integ."organizationId"
LEFT JOIN "Invitation" inv ON o.id = inv."organizationId"
LEFT JOIN "Member" mem ON o.id = mem."organizationId"
LEFT JOIN "Policy" pol ON o.id = pol."organizationId"
LEFT JOIN "Risk" rsk ON o.id = rsk."organizationId"
LEFT JOIN "Vendor" ven ON o.id = ven."organizationId"
LEFT JOIN "Task" tsk ON o.id = tsk."organizationId"
LEFT JOIN "Comment" cmt ON o.id = cmt."organizationId"
LEFT JOIN "Attachment" att ON o.id = att."organizationId"
LEFT JOIN "Trust" trst ON o.id = trst."organizationId"
LEFT JOIN "Context" ctx ON o.id = ctx."organizationId"
GROUP BY o.id, o.name, o.slug;

CREATE UNIQUE INDEX "idx_organization_stats_organizationId" ON "OrganizationStats" ("organizationId");