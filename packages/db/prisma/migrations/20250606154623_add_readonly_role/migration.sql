-- This script creates a 'readonly' role with SELECT permissions on all tables
-- in all non-system schemas, and ensures it gets access to future tables.

-- Create the new role
DROP ROLE IF EXISTS readonly;
CREATE ROLE readonly;

-- Grant USAGE on all existing schemas to the 'readonly' role
DO
$$
    DECLARE
        v_schema_name TEXT;
    BEGIN
        FOR v_schema_name IN
            SELECT schema_name
            FROM information_schema.schemata
            WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
            LOOP
                EXECUTE format('GRANT USAGE ON SCHEMA %I TO readonly', v_schema_name);
            END LOOP;
    END
$$;

-- Grant SELECT on all existing tables in all non-system schemas to the 'readonly' role
DO
$$
    DECLARE
        schema_name TEXT;
        table_name  TEXT;
    BEGIN
        FOR schema_name, table_name IN
            SELECT t.table_schema, t.table_name
            FROM information_schema.tables t
            WHERE t.table_type = 'BASE TABLE'
              AND t.table_schema NOT IN ('pg_catalog', 'information_schema')
            LOOP
                EXECUTE format('GRANT SELECT ON TABLE %I.%I TO readonly', schema_name, table_name);
            END LOOP;
    END
$$;

-- Grant SELECT on all future tables in all non-system schemas
DO
$$
    DECLARE
        v_schema_name TEXT;
    BEGIN
        FOR v_schema_name IN
            SELECT schema_name
            FROM information_schema.schemata
            WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
            LOOP
                EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT SELECT ON TABLES TO readonly',
                               v_schema_name);
            END LOOP;
    END
$$;