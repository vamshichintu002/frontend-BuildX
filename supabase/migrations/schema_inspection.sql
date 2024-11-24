-- Get all tables and their columns with data types and constraints
WITH table_columns AS (
    SELECT 
        t.table_name,
        c.column_name,
        c.data_type,
        c.column_default,
        c.is_nullable,
        c.character_maximum_length,
        c.numeric_precision,
        c.numeric_scale
    FROM 
        information_schema.tables t
        JOIN information_schema.columns c ON t.table_name = c.table_name
    WHERE 
        t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
    ORDER BY 
        t.table_name,
        c.ordinal_position
),
constraints AS (
    SELECT
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        CASE
            WHEN tc.constraint_type = 'FOREIGN KEY' THEN
                ccu.table_name || '(' || ccu.column_name || ')'
            ELSE NULL
        END as references_info
    FROM 
        information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
    WHERE 
        tc.table_schema = 'public'
),
indexes AS (
    SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
    FROM
        pg_indexes
    WHERE
        schemaname = 'public'
),
policies AS (
    SELECT
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
    FROM
        pg_policies
    WHERE
        schemaname = 'public'
)

-- Output all information
SELECT 
    format(E'\n=== Table: %s ===\n', tc.table_name) as table_info,
    format(E'Columns:\n%s\n',
        string_agg(
            format(E'  - %s %s%s%s', 
                tc.column_name, 
                tc.data_type,
                CASE WHEN tc.is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
                CASE WHEN tc.column_default IS NOT NULL THEN format(' DEFAULT %s', tc.column_default) ELSE '' END
            ),
            E'\n'
        )
    ) as columns,
    format(E'Constraints:\n%s\n',
        COALESCE(string_agg(
            format(E'  - %s: %s %s %s',
                c.constraint_name,
                c.constraint_type,
                c.column_name,
                COALESCE('REFERENCES ' || c.references_info, '')
            ),
            E'\n'
        ), 'No constraints')
    ) as constraints,
    format(E'Indexes:\n%s\n',
        COALESCE(string_agg(
            format(E'  - %s: %s',
                i.indexname,
                i.indexdef
            ),
            E'\n'
        ), 'No indexes')
    ) as indexes,
    format(E'RLS Policies:\n%s\n',
        COALESCE(string_agg(
            format(E'  - %s (%s):\n    USING: %s\n    WITH CHECK: %s',
                p.policyname,
                p.cmd,
                COALESCE(p.qual, 'None'),
                COALESCE(p.with_check, 'None')
            ),
            E'\n'
        ), 'No RLS policies')
    ) as policies
FROM 
    table_columns tc
    LEFT JOIN constraints c ON tc.table_name = c.table_name
    LEFT JOIN indexes i ON tc.table_name = i.tablename
    LEFT JOIN policies p ON tc.table_name = p.tablename
GROUP BY 
    tc.table_name
ORDER BY 
    tc.table_name;

-- Get table row counts
SELECT 
    table_name,
    (xpath('/row/c/text()', query_to_xml(format('SELECT COUNT(*) AS c FROM %I.%I', table_schema, table_name), FALSE, TRUE, '')))[1]::text::int AS row_count
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
ORDER BY table_name;
