import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The contact Worker connects as `contact_worker`, a role created by hand per Neon branch
// (its password is a Worker secret, so it can't live here). It may only insert inquiries
// and read back the new id. Databases without the role, such as CI and demo, skip this.
// A later migration that rebuilds `inquiries` or adds a column the Worker writes must
// re-run these grants.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'contact_worker') THEN
        GRANT USAGE ON SCHEMA public TO contact_worker;
        GRANT INSERT (profile, name, email, project_type, message, timeline) ON inquiries TO contact_worker;
        GRANT SELECT (id) ON inquiries TO contact_worker;
        GRANT USAGE ON SEQUENCE inquiries_id_seq TO contact_worker;
      END IF;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'contact_worker') THEN
        REVOKE ALL ON inquiries FROM contact_worker;
        REVOKE ALL ON SEQUENCE inquiries_id_seq FROM contact_worker;
      END IF;
    END
    $$;
  `)
}
