INSERT INTO "Context" (
    id,
    "organizationId",
    question,
    answer,
    tags,
    "createdAt",
    "updatedAt"
)
SELECT
    concat('ctx_', gen_random_uuid()),
    "organizationId",
    key,
    value::text,
    ARRAY[key],
    NOW(),
    NOW()
FROM (
    SELECT
        "organizationId",
        jsonb_each(companyDetails::jsonb->'data') as kv
    FROM "Onboarding"
    WHERE companyDetails IS NOT NULL
) t,
LATERAL (
    SELECT kv.key, kv.value
) s;