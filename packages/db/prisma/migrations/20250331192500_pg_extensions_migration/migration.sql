DO $$
DECLARE
  is_supabase boolean;
BEGIN
  RAISE NOTICE 'Starting pg_extensions_migration...';

  -- Check if we're in a Supabase environment by looking for specific schemas
  SELECT EXISTS (
    SELECT 1
    FROM pg_namespace
    WHERE nspname = 'supabase'
  ) INTO is_supabase;

  RAISE NOTICE 'Is Supabase environment: %', is_supabase;

  IF is_supabase THEN
    CREATE SCHEMA IF NOT EXISTS graphql;
    CREATE SCHEMA IF NOT EXISTS extensions;
    CREATE SCHEMA IF NOT EXISTS vault;
    CREATE SCHEMA IF NOT EXISTS pgsodium;

    CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;
    CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;
    CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
    CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;
    CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;
    CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

    RAISE NOTICE 'Successfully created all extensions and schemas';
  ELSE
    RAISE NOTICE 'Skipping extension creation - not a Supabase database';
  END IF;

  RAISE NOTICE 'Completed pg_extensions_migration';
END $$;