-- Create function to generate prefixed CUID
CREATE OR REPLACE FUNCTION generate_prefixed_cuid(prefix text)
RETURNS text AS $$
DECLARE
    timestamp_part text;
    counter_part text;
    fingerprint_part text;
    random_part text;
BEGIN
    -- Generate timestamp component (first 8 chars)
    timestamp_part = LOWER(TO_HEX(EXTRACT(EPOCH FROM NOW())::BIGINT));
    
    -- Generate counter component (4 chars)
    counter_part = LOWER(TO_HEX((RANDOM() * 16777215)::INT));
    
    -- Generate fingerprint (4 chars)
    fingerprint_part = LOWER(TO_HEX((RANDOM() * 16777215)::INT));
    
    -- Generate random component (8 chars) 
    random_part = LOWER(TO_HEX((RANDOM() * 4294967295)::BIGINT));

    -- Combine all parts with prefix
    RETURN prefix || '_' || timestamp_part || counter_part || fingerprint_part || random_part;
END;
$$ LANGUAGE plpgsql;
