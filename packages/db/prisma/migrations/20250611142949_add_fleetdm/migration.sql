-- Create function to generate a random secret
CREATE OR REPLACE FUNCTION generate_random_secret(length integer DEFAULT 32)
RETURNS text AS $$
DECLARE
    result text;
BEGIN
    -- Generate random bytes and encode as hex
    -- Using gen_random_bytes from pgcrypto extension
    result = encode(gen_random_bytes(length), 'hex');
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "fleetDmLabelId" INTEGER,
ADD COLUMN     "fleetDmSecret" TEXT NOT NULL DEFAULT generate_random_secret(32),
ADD COLUMN     "isFleetSetupCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "osqueryAgentDownloadUrl" TEXT;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "fleetDmLabelId" INTEGER;