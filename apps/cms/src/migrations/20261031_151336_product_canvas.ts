import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_canvas_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" varchar,
  	"user_does" varchar,
  	"pain" varchar,
  	"fix" varchar
  );
  
  CREATE TABLE "projects_canvas_decisions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_canvas_decisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"chosen" varchar,
  	"why" varchar
  );
  
  CREATE TABLE "projects_canvas_comparison_before" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_canvas_comparison_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_projects_v_version_canvas_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"stage" varchar,
  	"user_does" varchar,
  	"pain" varchar,
  	"fix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_canvas_decisions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_canvas_decisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"chosen" varchar,
  	"why" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_canvas_comparison_before" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_canvas_comparison_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "posts_canvas_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" varchar,
  	"user_does" varchar,
  	"pain" varchar,
  	"fix" varchar
  );
  
  CREATE TABLE "posts_canvas_decisions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "posts_canvas_decisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"chosen" varchar,
  	"why" varchar
  );
  
  CREATE TABLE "posts_canvas_comparison_before" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "posts_canvas_comparison_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_posts_v_version_canvas_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"stage" varchar,
  	"user_does" varchar,
  	"pain" varchar,
  	"fix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_canvas_decisions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_canvas_decisions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"chosen" varchar,
  	"why" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_canvas_comparison_before" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_canvas_comparison_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "projects" ADD COLUMN "canvas_comparison_before_title" varchar;
  ALTER TABLE "projects" ADD COLUMN "canvas_comparison_after_title" varchar;
  ALTER TABLE "projects" ADD COLUMN "canvas_comparison_before_image_id" integer;
  ALTER TABLE "projects" ADD COLUMN "canvas_comparison_after_image_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_canvas_comparison_before_title" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_canvas_comparison_after_title" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_canvas_comparison_before_image_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_canvas_comparison_after_image_id" integer;
  ALTER TABLE "posts" ADD COLUMN "canvas_comparison_before_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "canvas_comparison_after_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "canvas_comparison_before_image_id" integer;
  ALTER TABLE "posts" ADD COLUMN "canvas_comparison_after_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_canvas_comparison_before_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_canvas_comparison_after_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_canvas_comparison_before_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_canvas_comparison_after_image_id" integer;
  ALTER TABLE "projects_canvas_journey" ADD CONSTRAINT "projects_canvas_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_canvas_decisions_options" ADD CONSTRAINT "projects_canvas_decisions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_canvas_decisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_canvas_decisions" ADD CONSTRAINT "projects_canvas_decisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_canvas_comparison_before" ADD CONSTRAINT "projects_canvas_comparison_before_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_canvas_comparison_after" ADD CONSTRAINT "projects_canvas_comparison_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_canvas_journey" ADD CONSTRAINT "_projects_v_version_canvas_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_canvas_decisions_options" ADD CONSTRAINT "_projects_v_version_canvas_decisions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_canvas_decisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_canvas_decisions" ADD CONSTRAINT "_projects_v_version_canvas_decisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_canvas_comparison_before" ADD CONSTRAINT "_projects_v_version_canvas_comparison_before_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_canvas_comparison_after" ADD CONSTRAINT "_projects_v_version_canvas_comparison_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_canvas_journey" ADD CONSTRAINT "posts_canvas_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_canvas_decisions_options" ADD CONSTRAINT "posts_canvas_decisions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_canvas_decisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_canvas_decisions" ADD CONSTRAINT "posts_canvas_decisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_canvas_comparison_before" ADD CONSTRAINT "posts_canvas_comparison_before_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_canvas_comparison_after" ADD CONSTRAINT "posts_canvas_comparison_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_canvas_journey" ADD CONSTRAINT "_posts_v_version_canvas_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_canvas_decisions_options" ADD CONSTRAINT "_posts_v_version_canvas_decisions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_version_canvas_decisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_canvas_decisions" ADD CONSTRAINT "_posts_v_version_canvas_decisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_canvas_comparison_before" ADD CONSTRAINT "_posts_v_version_canvas_comparison_before_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_canvas_comparison_after" ADD CONSTRAINT "_posts_v_version_canvas_comparison_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_canvas_journey_order_idx" ON "projects_canvas_journey" USING btree ("_order");
  CREATE INDEX "projects_canvas_journey_parent_id_idx" ON "projects_canvas_journey" USING btree ("_parent_id");
  CREATE INDEX "projects_canvas_decisions_options_order_idx" ON "projects_canvas_decisions_options" USING btree ("_order");
  CREATE INDEX "projects_canvas_decisions_options_parent_id_idx" ON "projects_canvas_decisions_options" USING btree ("_parent_id");
  CREATE INDEX "projects_canvas_decisions_order_idx" ON "projects_canvas_decisions" USING btree ("_order");
  CREATE INDEX "projects_canvas_decisions_parent_id_idx" ON "projects_canvas_decisions" USING btree ("_parent_id");
  CREATE INDEX "projects_canvas_comparison_before_order_idx" ON "projects_canvas_comparison_before" USING btree ("_order");
  CREATE INDEX "projects_canvas_comparison_before_parent_id_idx" ON "projects_canvas_comparison_before" USING btree ("_parent_id");
  CREATE INDEX "projects_canvas_comparison_after_order_idx" ON "projects_canvas_comparison_after" USING btree ("_order");
  CREATE INDEX "projects_canvas_comparison_after_parent_id_idx" ON "projects_canvas_comparison_after" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_canvas_journey_order_idx" ON "_projects_v_version_canvas_journey" USING btree ("_order");
  CREATE INDEX "_projects_v_version_canvas_journey_parent_id_idx" ON "_projects_v_version_canvas_journey" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_canvas_decisions_options_order_idx" ON "_projects_v_version_canvas_decisions_options" USING btree ("_order");
  CREATE INDEX "_projects_v_version_canvas_decisions_options_parent_id_idx" ON "_projects_v_version_canvas_decisions_options" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_canvas_decisions_order_idx" ON "_projects_v_version_canvas_decisions" USING btree ("_order");
  CREATE INDEX "_projects_v_version_canvas_decisions_parent_id_idx" ON "_projects_v_version_canvas_decisions" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_canvas_comparison_before_order_idx" ON "_projects_v_version_canvas_comparison_before" USING btree ("_order");
  CREATE INDEX "_projects_v_version_canvas_comparison_before_parent_id_idx" ON "_projects_v_version_canvas_comparison_before" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_canvas_comparison_after_order_idx" ON "_projects_v_version_canvas_comparison_after" USING btree ("_order");
  CREATE INDEX "_projects_v_version_canvas_comparison_after_parent_id_idx" ON "_projects_v_version_canvas_comparison_after" USING btree ("_parent_id");
  CREATE INDEX "posts_canvas_journey_order_idx" ON "posts_canvas_journey" USING btree ("_order");
  CREATE INDEX "posts_canvas_journey_parent_id_idx" ON "posts_canvas_journey" USING btree ("_parent_id");
  CREATE INDEX "posts_canvas_decisions_options_order_idx" ON "posts_canvas_decisions_options" USING btree ("_order");
  CREATE INDEX "posts_canvas_decisions_options_parent_id_idx" ON "posts_canvas_decisions_options" USING btree ("_parent_id");
  CREATE INDEX "posts_canvas_decisions_order_idx" ON "posts_canvas_decisions" USING btree ("_order");
  CREATE INDEX "posts_canvas_decisions_parent_id_idx" ON "posts_canvas_decisions" USING btree ("_parent_id");
  CREATE INDEX "posts_canvas_comparison_before_order_idx" ON "posts_canvas_comparison_before" USING btree ("_order");
  CREATE INDEX "posts_canvas_comparison_before_parent_id_idx" ON "posts_canvas_comparison_before" USING btree ("_parent_id");
  CREATE INDEX "posts_canvas_comparison_after_order_idx" ON "posts_canvas_comparison_after" USING btree ("_order");
  CREATE INDEX "posts_canvas_comparison_after_parent_id_idx" ON "posts_canvas_comparison_after" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_canvas_journey_order_idx" ON "_posts_v_version_canvas_journey" USING btree ("_order");
  CREATE INDEX "_posts_v_version_canvas_journey_parent_id_idx" ON "_posts_v_version_canvas_journey" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_canvas_decisions_options_order_idx" ON "_posts_v_version_canvas_decisions_options" USING btree ("_order");
  CREATE INDEX "_posts_v_version_canvas_decisions_options_parent_id_idx" ON "_posts_v_version_canvas_decisions_options" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_canvas_decisions_order_idx" ON "_posts_v_version_canvas_decisions" USING btree ("_order");
  CREATE INDEX "_posts_v_version_canvas_decisions_parent_id_idx" ON "_posts_v_version_canvas_decisions" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_canvas_comparison_before_order_idx" ON "_posts_v_version_canvas_comparison_before" USING btree ("_order");
  CREATE INDEX "_posts_v_version_canvas_comparison_before_parent_id_idx" ON "_posts_v_version_canvas_comparison_before" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_canvas_comparison_after_order_idx" ON "_posts_v_version_canvas_comparison_after" USING btree ("_order");
  CREATE INDEX "_posts_v_version_canvas_comparison_after_parent_id_idx" ON "_posts_v_version_canvas_comparison_after" USING btree ("_parent_id");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_canvas_comparison_before_image_id_media_id_fk" FOREIGN KEY ("canvas_comparison_before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_canvas_comparison_after_image_id_media_id_fk" FOREIGN KEY ("canvas_comparison_after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_canvas_comparison_before_image_id_media_id_fk" FOREIGN KEY ("version_canvas_comparison_before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_canvas_comparison_after_image_id_media_id_fk" FOREIGN KEY ("version_canvas_comparison_after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_canvas_comparison_before_image_id_media_id_fk" FOREIGN KEY ("canvas_comparison_before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_canvas_comparison_after_image_id_media_id_fk" FOREIGN KEY ("canvas_comparison_after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_canvas_comparison_before_image_id_media_id_fk" FOREIGN KEY ("version_canvas_comparison_before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_canvas_comparison_after_image_id_media_id_fk" FOREIGN KEY ("version_canvas_comparison_after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_canvas_comparison_canvas_comparison_before_imag_idx" ON "projects" USING btree ("canvas_comparison_before_image_id");
  CREATE INDEX "projects_canvas_comparison_canvas_comparison_after_image_idx" ON "projects" USING btree ("canvas_comparison_after_image_id");
  CREATE INDEX "_projects_v_version_canvas_comparison_version_canvas_com_idx" ON "_projects_v" USING btree ("version_canvas_comparison_before_image_id");
  CREATE INDEX "_projects_v_version_canvas_comparison_version_canvas_c_1_idx" ON "_projects_v" USING btree ("version_canvas_comparison_after_image_id");
  CREATE INDEX "posts_canvas_comparison_canvas_comparison_before_image_idx" ON "posts" USING btree ("canvas_comparison_before_image_id");
  CREATE INDEX "posts_canvas_comparison_canvas_comparison_after_image_idx" ON "posts" USING btree ("canvas_comparison_after_image_id");
  CREATE INDEX "_posts_v_version_canvas_comparison_version_canvas_compar_idx" ON "_posts_v" USING btree ("version_canvas_comparison_before_image_id");
  CREATE INDEX "_posts_v_version_canvas_comparison_version_canvas_comp_1_idx" ON "_posts_v" USING btree ("version_canvas_comparison_after_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_canvas_journey" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_canvas_decisions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_canvas_decisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_canvas_comparison_before" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_canvas_comparison_after" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_canvas_journey" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_canvas_decisions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_canvas_decisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_canvas_comparison_before" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_canvas_comparison_after" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_canvas_journey" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_canvas_decisions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_canvas_decisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_canvas_comparison_before" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_canvas_comparison_after" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_canvas_journey" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_canvas_decisions_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_canvas_decisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_canvas_comparison_before" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_canvas_comparison_after" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_canvas_journey" CASCADE;
  DROP TABLE "projects_canvas_decisions_options" CASCADE;
  DROP TABLE "projects_canvas_decisions" CASCADE;
  DROP TABLE "projects_canvas_comparison_before" CASCADE;
  DROP TABLE "projects_canvas_comparison_after" CASCADE;
  DROP TABLE "_projects_v_version_canvas_journey" CASCADE;
  DROP TABLE "_projects_v_version_canvas_decisions_options" CASCADE;
  DROP TABLE "_projects_v_version_canvas_decisions" CASCADE;
  DROP TABLE "_projects_v_version_canvas_comparison_before" CASCADE;
  DROP TABLE "_projects_v_version_canvas_comparison_after" CASCADE;
  DROP TABLE "posts_canvas_journey" CASCADE;
  DROP TABLE "posts_canvas_decisions_options" CASCADE;
  DROP TABLE "posts_canvas_decisions" CASCADE;
  DROP TABLE "posts_canvas_comparison_before" CASCADE;
  DROP TABLE "posts_canvas_comparison_after" CASCADE;
  DROP TABLE "_posts_v_version_canvas_journey" CASCADE;
  DROP TABLE "_posts_v_version_canvas_decisions_options" CASCADE;
  DROP TABLE "_posts_v_version_canvas_decisions" CASCADE;
  DROP TABLE "_posts_v_version_canvas_comparison_before" CASCADE;
  DROP TABLE "_posts_v_version_canvas_comparison_after" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_canvas_comparison_before_image_id_media_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_canvas_comparison_after_image_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_canvas_comparison_before_image_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_canvas_comparison_after_image_id_media_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_canvas_comparison_before_image_id_media_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_canvas_comparison_after_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_canvas_comparison_before_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_canvas_comparison_after_image_id_media_id_fk";
  
  DROP INDEX "projects_canvas_comparison_canvas_comparison_before_imag_idx";
  DROP INDEX "projects_canvas_comparison_canvas_comparison_after_image_idx";
  DROP INDEX "_projects_v_version_canvas_comparison_version_canvas_com_idx";
  DROP INDEX "_projects_v_version_canvas_comparison_version_canvas_c_1_idx";
  DROP INDEX "posts_canvas_comparison_canvas_comparison_before_image_idx";
  DROP INDEX "posts_canvas_comparison_canvas_comparison_after_image_idx";
  DROP INDEX "_posts_v_version_canvas_comparison_version_canvas_compar_idx";
  DROP INDEX "_posts_v_version_canvas_comparison_version_canvas_comp_1_idx";
  ALTER TABLE "projects" DROP COLUMN "canvas_comparison_before_title";
  ALTER TABLE "projects" DROP COLUMN "canvas_comparison_after_title";
  ALTER TABLE "projects" DROP COLUMN "canvas_comparison_before_image_id";
  ALTER TABLE "projects" DROP COLUMN "canvas_comparison_after_image_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_canvas_comparison_before_title";
  ALTER TABLE "_projects_v" DROP COLUMN "version_canvas_comparison_after_title";
  ALTER TABLE "_projects_v" DROP COLUMN "version_canvas_comparison_before_image_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_canvas_comparison_after_image_id";
  ALTER TABLE "posts" DROP COLUMN "canvas_comparison_before_title";
  ALTER TABLE "posts" DROP COLUMN "canvas_comparison_after_title";
  ALTER TABLE "posts" DROP COLUMN "canvas_comparison_before_image_id";
  ALTER TABLE "posts" DROP COLUMN "canvas_comparison_after_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_canvas_comparison_before_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_canvas_comparison_after_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_canvas_comparison_before_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_canvas_comparison_after_image_id";`)
}
