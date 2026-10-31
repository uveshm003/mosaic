import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_group" AS ENUM('build', 'fix', 'embed');
  CREATE TYPE "public"."enum__services_v_version_group" AS ENUM('build', 'fix', 'embed');
  CREATE TABLE "profiles_freelance_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "profiles_freelance_engagement_you_get" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "profiles_freelance_engagement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"when" varchar,
  	"summary" varchar,
  	"your_part" varchar
  );
  
  CREATE TABLE "profiles_freelance_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "profiles_freelance_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  ALTER TABLE "services" ADD COLUMN "group" "enum_services_group" DEFAULT 'build';
  ALTER TABLE "_services_v" ADD COLUMN "version_group" "enum__services_v_version_group" DEFAULT 'build';
  ALTER TABLE "profiles_freelance_audience" ADD CONSTRAINT "profiles_freelance_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profiles_freelance_engagement_you_get" ADD CONSTRAINT "profiles_freelance_engagement_you_get_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles_freelance_engagement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profiles_freelance_engagement" ADD CONSTRAINT "profiles_freelance_engagement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profiles_freelance_principles" ADD CONSTRAINT "profiles_freelance_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profiles_freelance_faq" ADD CONSTRAINT "profiles_freelance_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profiles_freelance_audience_order_idx" ON "profiles_freelance_audience" USING btree ("_order");
  CREATE INDEX "profiles_freelance_audience_parent_id_idx" ON "profiles_freelance_audience" USING btree ("_parent_id");
  CREATE INDEX "profiles_freelance_engagement_you_get_order_idx" ON "profiles_freelance_engagement_you_get" USING btree ("_order");
  CREATE INDEX "profiles_freelance_engagement_you_get_parent_id_idx" ON "profiles_freelance_engagement_you_get" USING btree ("_parent_id");
  CREATE INDEX "profiles_freelance_engagement_order_idx" ON "profiles_freelance_engagement" USING btree ("_order");
  CREATE INDEX "profiles_freelance_engagement_parent_id_idx" ON "profiles_freelance_engagement" USING btree ("_parent_id");
  CREATE INDEX "profiles_freelance_principles_order_idx" ON "profiles_freelance_principles" USING btree ("_order");
  CREATE INDEX "profiles_freelance_principles_parent_id_idx" ON "profiles_freelance_principles" USING btree ("_parent_id");
  CREATE INDEX "profiles_freelance_faq_order_idx" ON "profiles_freelance_faq" USING btree ("_order");
  CREATE INDEX "profiles_freelance_faq_parent_id_idx" ON "profiles_freelance_faq" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profiles_freelance_audience" CASCADE;
  DROP TABLE "profiles_freelance_engagement_you_get" CASCADE;
  DROP TABLE "profiles_freelance_engagement" CASCADE;
  DROP TABLE "profiles_freelance_principles" CASCADE;
  DROP TABLE "profiles_freelance_faq" CASCADE;
  ALTER TABLE "services" DROP COLUMN "group";
  ALTER TABLE "_services_v" DROP COLUMN "version_group";
  DROP TYPE "public"."enum_services_group";
  DROP TYPE "public"."enum__services_v_version_group";`)
}
