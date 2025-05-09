-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION generate_prefixed_cuid(prefix text)
RETURNS text AS $$
DECLARE
    timestamp_hex text;
    random_hex text;
BEGIN
    -- Generate timestamp component (seconds since epoch) as hex
    timestamp_hex = LOWER(TO_HEX(EXTRACT(EPOCH FROM NOW())::BIGINT));

    -- Generate 8 random bytes and encode as hex (16 characters)
    -- Ensure we call the function from the correct schema if pgcrypto is installed elsewhere
    random_hex = encode(gen_random_bytes(8), 'hex');

    -- Combine prefix, timestamp, and random hex string
    RETURN prefix || '_' || timestamp_hex || random_hex;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_prefixed_cuid_long(prefix text)
RETURNS text AS $$
DECLARE
    timestamp_hex text;
    random_hex text;
BEGIN
    -- Generate timestamp component (seconds since epoch) as hex
    timestamp_hex = LOWER(TO_HEX(EXTRACT(EPOCH FROM NOW())::BIGINT));

    -- Generate 16 random bytes and encode as hex (32 characters)
    -- Ensure we call the function from the correct schema if pgcrypto is installed elsewhere
    random_hex = encode(gen_random_bytes(16), 'hex');

    -- Combine prefix, timestamp, and random hex string
    RETURN prefix || '_' || timestamp_hex || random_hex;
END;
$$ LANGUAGE plpgsql;
