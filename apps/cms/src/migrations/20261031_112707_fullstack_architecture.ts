import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_architecture_nodes_kind" AS ENUM('client', 'service', 'data', 'queue', 'external');
  CREATE TYPE "public"."enum__projects_v_version_architecture_nodes_kind" AS ENUM('client', 'service', 'data', 'queue', 'external');
  CREATE TABLE "projects_architecture_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"tech" varchar,
  	"kind" "enum_projects_architecture_nodes_kind" DEFAULT 'service',
  	"column" numeric DEFAULT 0,
  	"row" numeric DEFAULT 0
  );
  
  CREATE TABLE "projects_architecture_edges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" varchar,
  	"to" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "projects_architecture_trace" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" varchar,
  	"to" varchar,
  	"label" varchar,
  	"code" varchar
  );
  
  CREATE TABLE "_projects_v_version_architecture_nodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"tech" varchar,
  	"kind" "enum__projects_v_version_architecture_nodes_kind" DEFAULT 'service',
  	"column" numeric DEFAULT 0,
  	"row" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_architecture_edges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar,
  	"to" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_architecture_trace" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar,
  	"to" varchar,
  	"label" varchar,
  	"code" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "projects" ADD COLUMN "links_demo_admin" boolean DEFAULT false;
  ALTER TABLE "_projects_v" ADD COLUMN "version_links_demo_admin" boolean DEFAULT false;
  ALTER TABLE "profiles" ADD COLUMN "fullstack_demo_admin_url" varchar;
  ALTER TABLE "projects_architecture_nodes" ADD CONSTRAINT "projects_architecture_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_architecture_edges" ADD CONSTRAINT "projects_architecture_edges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_architecture_trace" ADD CONSTRAINT "projects_architecture_trace_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_architecture_nodes" ADD CONSTRAINT "_projects_v_version_architecture_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_architecture_edges" ADD CONSTRAINT "_projects_v_version_architecture_edges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_architecture_trace" ADD CONSTRAINT "_projects_v_version_architecture_trace_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_architecture_nodes_order_idx" ON "projects_architecture_nodes" USING btree ("_order");
  CREATE INDEX "projects_architecture_nodes_parent_id_idx" ON "projects_architecture_nodes" USING btree ("_parent_id");
  CREATE INDEX "projects_architecture_edges_order_idx" ON "projects_architecture_edges" USING btree ("_order");
  CREATE INDEX "projects_architecture_edges_parent_id_idx" ON "projects_architecture_edges" USING btree ("_parent_id");
  CREATE INDEX "projects_architecture_trace_order_idx" ON "projects_architecture_trace" USING btree ("_order");
  CREATE INDEX "projects_architecture_trace_parent_id_idx" ON "projects_architecture_trace" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_architecture_nodes_order_idx" ON "_projects_v_version_architecture_nodes" USING btree ("_order");
  CREATE INDEX "_projects_v_version_architecture_nodes_parent_id_idx" ON "_projects_v_version_architecture_nodes" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_architecture_edges_order_idx" ON "_projects_v_version_architecture_edges" USING btree ("_order");
  CREATE INDEX "_projects_v_version_architecture_edges_parent_id_idx" ON "_projects_v_version_architecture_edges" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_architecture_trace_order_idx" ON "_projects_v_version_architecture_trace" USING btree ("_order");
  CREATE INDEX "_projects_v_version_architecture_trace_parent_id_idx" ON "_projects_v_version_architecture_trace" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_architecture_nodes" CASCADE;
  DROP TABLE "projects_architecture_edges" CASCADE;
  DROP TABLE "projects_architecture_trace" CASCADE;
  DROP TABLE "_projects_v_version_architecture_nodes" CASCADE;
  DROP TABLE "_projects_v_version_architecture_edges" CASCADE;
  DROP TABLE "_projects_v_version_architecture_trace" CASCADE;
  ALTER TABLE "projects" DROP COLUMN "links_demo_admin";
  ALTER TABLE "_projects_v" DROP COLUMN "version_links_demo_admin";
  ALTER TABLE "profiles" DROP COLUMN "fullstack_demo_admin_url";
  DROP TYPE "public"."enum_projects_architecture_nodes_kind";
  DROP TYPE "public"."enum__projects_v_version_architecture_nodes_kind";`)
}
