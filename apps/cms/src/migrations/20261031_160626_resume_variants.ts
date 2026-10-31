import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_resume_variants" AS ENUM('product-company', 'android', 'flutter', 'broad', 'fullstack');
  CREATE TYPE "public"."enum__projects_v_version_resume_variants" AS ENUM('product-company', 'android', 'flutter', 'broad', 'fullstack');
  CREATE TYPE "public"."enum_experience_highlights_variants" AS ENUM('product-company', 'android', 'flutter', 'broad', 'fullstack');
  CREATE TYPE "public"."enum_education_highlights_variants" AS ENUM('product-company', 'android', 'flutter', 'broad', 'fullstack');
  CREATE TYPE "public"."enum_person_resume_headlines_variant" AS ENUM('product-company', 'android', 'flutter', 'broad', 'fullstack');
  CREATE TYPE "public"."enum__person_v_version_resume_headlines_variant" AS ENUM('product-company', 'android', 'flutter', 'broad', 'fullstack');
  CREATE TABLE "projects_resume_variants" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_projects_resume_variants",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_resume_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_resume" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"order" numeric,
  	"tagline" varchar
  );
  
  CREATE TABLE "_projects_v_version_resume_variants" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_resume_variants",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_resume_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_resume" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"order" numeric,
  	"tagline" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "experience_highlights_variants" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_experience_highlights_variants",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "education_highlights_variants" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_education_highlights_variants",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "person_resume_headlines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_person_resume_headlines_variant",
  	"text" varchar
  );
  
  CREATE TABLE "_person_v_version_resume_headlines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__person_v_version_resume_headlines_variant",
  	"text" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "person" ADD COLUMN "resume_name" varchar;
  ALTER TABLE "person" ADD COLUMN "resume_phone" varchar;
  ALTER TABLE "person" ADD COLUMN "resume_languages" varchar;
  ALTER TABLE "_person_v" ADD COLUMN "version_resume_name" varchar;
  ALTER TABLE "_person_v" ADD COLUMN "version_resume_phone" varchar;
  ALTER TABLE "_person_v" ADD COLUMN "version_resume_languages" varchar;
  ALTER TABLE "projects_resume_variants" ADD CONSTRAINT "projects_resume_variants_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_resume_bullets" ADD CONSTRAINT "projects_resume_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_resume" ADD CONSTRAINT "projects_resume_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_resume_variants" ADD CONSTRAINT "_projects_v_version_resume_variants_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v_version_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_resume_bullets" ADD CONSTRAINT "_projects_v_version_resume_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_resume" ADD CONSTRAINT "_projects_v_version_resume_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experience_highlights_variants" ADD CONSTRAINT "experience_highlights_variants_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experience_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_highlights_variants" ADD CONSTRAINT "education_highlights_variants_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."education_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "person_resume_headlines" ADD CONSTRAINT "person_resume_headlines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_person_v_version_resume_headlines" ADD CONSTRAINT "_person_v_version_resume_headlines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_person_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_resume_variants_order_idx" ON "projects_resume_variants" USING btree ("order");
  CREATE INDEX "projects_resume_variants_parent_idx" ON "projects_resume_variants" USING btree ("parent_id");
  CREATE INDEX "projects_resume_bullets_order_idx" ON "projects_resume_bullets" USING btree ("_order");
  CREATE INDEX "projects_resume_bullets_parent_id_idx" ON "projects_resume_bullets" USING btree ("_parent_id");
  CREATE INDEX "projects_resume_order_idx" ON "projects_resume" USING btree ("_order");
  CREATE INDEX "projects_resume_parent_id_idx" ON "projects_resume" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_resume_variants_order_idx" ON "_projects_v_version_resume_variants" USING btree ("order");
  CREATE INDEX "_projects_v_version_resume_variants_parent_idx" ON "_projects_v_version_resume_variants" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_resume_bullets_order_idx" ON "_projects_v_version_resume_bullets" USING btree ("_order");
  CREATE INDEX "_projects_v_version_resume_bullets_parent_id_idx" ON "_projects_v_version_resume_bullets" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_resume_order_idx" ON "_projects_v_version_resume" USING btree ("_order");
  CREATE INDEX "_projects_v_version_resume_parent_id_idx" ON "_projects_v_version_resume" USING btree ("_parent_id");
  CREATE INDEX "experience_highlights_variants_order_idx" ON "experience_highlights_variants" USING btree ("order");
  CREATE INDEX "experience_highlights_variants_parent_idx" ON "experience_highlights_variants" USING btree ("parent_id");
  CREATE INDEX "education_highlights_variants_order_idx" ON "education_highlights_variants" USING btree ("order");
  CREATE INDEX "education_highlights_variants_parent_idx" ON "education_highlights_variants" USING btree ("parent_id");
  CREATE INDEX "person_resume_headlines_order_idx" ON "person_resume_headlines" USING btree ("_order");
  CREATE INDEX "person_resume_headlines_parent_id_idx" ON "person_resume_headlines" USING btree ("_parent_id");
  CREATE INDEX "_person_v_version_resume_headlines_order_idx" ON "_person_v_version_resume_headlines" USING btree ("_order");
  CREATE INDEX "_person_v_version_resume_headlines_parent_id_idx" ON "_person_v_version_resume_headlines" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_resume_variants" CASCADE;
  DROP TABLE "projects_resume_bullets" CASCADE;
  DROP TABLE "projects_resume" CASCADE;
  DROP TABLE "_projects_v_version_resume_variants" CASCADE;
  DROP TABLE "_projects_v_version_resume_bullets" CASCADE;
  DROP TABLE "_projects_v_version_resume" CASCADE;
  DROP TABLE "experience_highlights_variants" CASCADE;
  DROP TABLE "education_highlights_variants" CASCADE;
  DROP TABLE "person_resume_headlines" CASCADE;
  DROP TABLE "_person_v_version_resume_headlines" CASCADE;
  ALTER TABLE "person" DROP COLUMN "resume_name";
  ALTER TABLE "person" DROP COLUMN "resume_phone";
  ALTER TABLE "person" DROP COLUMN "resume_languages";
  ALTER TABLE "_person_v" DROP COLUMN "version_resume_name";
  ALTER TABLE "_person_v" DROP COLUMN "version_resume_phone";
  ALTER TABLE "_person_v" DROP COLUMN "version_resume_languages";
  DROP TYPE "public"."enum_projects_resume_variants";
  DROP TYPE "public"."enum__projects_v_version_resume_variants";
  DROP TYPE "public"."enum_experience_highlights_variants";
  DROP TYPE "public"."enum_education_highlights_variants";
  DROP TYPE "public"."enum_person_resume_headlines_variant";
  DROP TYPE "public"."enum__person_v_version_resume_headlines_variant";`)
}
