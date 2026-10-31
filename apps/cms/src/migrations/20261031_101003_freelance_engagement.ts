import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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
  	"summary" varchar
  );
  
  ALTER TABLE "profiles_freelance_engagement_you_get" ADD CONSTRAINT "profiles_freelance_engagement_you_get_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles_freelance_engagement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profiles_freelance_engagement" ADD CONSTRAINT "profiles_freelance_engagement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profiles_freelance_engagement_you_get_order_idx" ON "profiles_freelance_engagement_you_get" USING btree ("_order");
  CREATE INDEX "profiles_freelance_engagement_you_get_parent_id_idx" ON "profiles_freelance_engagement_you_get" USING btree ("_parent_id");
  CREATE INDEX "profiles_freelance_engagement_order_idx" ON "profiles_freelance_engagement" USING btree ("_order");
  CREATE INDEX "profiles_freelance_engagement_parent_id_idx" ON "profiles_freelance_engagement" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profiles_freelance_engagement_you_get" CASCADE;
  DROP TABLE "profiles_freelance_engagement" CASCADE;`)
}
