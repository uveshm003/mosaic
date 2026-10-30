import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_platforms" AS ENUM('android', 'ios', 'web', 'macos', 'windows', 'linux');
  CREATE TYPE "public"."enum_projects_links_store_store" AS ENUM('app-store', 'play-store', 'microsoft-store', 'mac-app-store', 'other');
  CREATE TYPE "public"."enum_projects_profiles" AS ENUM('flutter', 'product', 'freelance', 'fullstack');
  CREATE TYPE "public"."enum_projects_overrides_profile" AS ENUM('flutter', 'product', 'freelance', 'fullstack');
  CREATE TYPE "public"."enum_projects_demo_status" AS ENUM('live', 'demo-build', 'video', 'repo-only', 'private');
  CREATE TYPE "public"."enum_projects_confidentiality" AS ENUM('public', 'restricted');
  CREATE TYPE "public"."enum_projects_kind" AS ENUM('work', 'freelance', 'personal', 'open-source');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_platforms" AS ENUM('android', 'ios', 'web', 'macos', 'windows', 'linux');
  CREATE TYPE "public"."enum__projects_v_version_links_store_store" AS ENUM('app-store', 'play-store', 'microsoft-store', 'mac-app-store', 'other');
  CREATE TYPE "public"."enum__projects_v_version_profiles" AS ENUM('flutter', 'product', 'freelance', 'fullstack');
  CREATE TYPE "public"."enum__projects_v_version_overrides_profile" AS ENUM('flutter', 'product', 'freelance', 'fullstack');
  CREATE TYPE "public"."enum__projects_v_version_demo_status" AS ENUM('live', 'demo-build', 'video', 'repo-only', 'private');
  CREATE TYPE "public"."enum__projects_v_version_confidentiality" AS ENUM('public', 'restricted');
  CREATE TYPE "public"."enum__projects_v_version_kind" AS ENUM('work', 'freelance', 'personal', 'open-source');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_profiles" AS ENUM('flutter', 'product', 'freelance', 'fullstack');
  CREATE TYPE "public"."enum_posts_site" AS ENUM('personal', 'brand');
  CREATE TYPE "public"."enum_posts_type" AS ENUM('essay', 'brand-breakdown', 'campaign-concept', 'book-notes', 'research-note', 'teardown', 'improvement-proposal', 'case-study', 'video');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_profiles" AS ENUM('flutter', 'product', 'freelance', 'fullstack');
  CREATE TYPE "public"."enum__posts_v_version_site" AS ENUM('personal', 'brand');
  CREATE TYPE "public"."enum__posts_v_version_type" AS ENUM('essay', 'brand-breakdown', 'campaign-concept', 'book-notes', 'research-note', 'teardown', 'improvement-proposal', 'case-study', 'video');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_inquiries_profile" AS ENUM('root', 'flutter', 'product', 'freelance', 'fullstack');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'replied', 'archived');
  CREATE TYPE "public"."enum_experience_variants" AS ENUM('product-company', 'android', 'flutter', 'broad', 'fullstack');
  CREATE TYPE "public"."enum_education_variants" AS ENUM('product-company', 'android', 'flutter', 'broad', 'fullstack');
  CREATE TYPE "public"."enum_skills_variants" AS ENUM('product-company', 'android', 'flutter', 'broad', 'fullstack');
  CREATE TYPE "public"."enum_tech_kind" AS ENUM('language', 'framework', 'tool', 'platform');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'reviewer');
  CREATE TYPE "public"."enum_person_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__person_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "projects_platforms" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_platforms",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_links_store" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"store" "enum_projects_links_store_store",
  	"url" varchar
  );
  
  CREATE TABLE "projects_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "projects_profiles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_profiles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_overrides_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"profile" "enum_projects_overrides_profile",
  	"title" varchar,
  	"summary" varchar,
  	"order" numeric,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"role" varchar,
  	"team" varchar,
  	"period_start" timestamp(3) with time zone,
  	"period_end" timestamp(3) with time zone,
  	"links_repo" varchar,
  	"links_live" varchar,
  	"links_video" varchar,
  	"demo_status" "enum_projects_demo_status",
  	"confidentiality" "enum_projects_confidentiality" DEFAULT 'restricted',
  	"kind" "enum_projects_kind",
  	"employer" varchar,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tech_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_projects_v_version_platforms" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_platforms",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_links_store" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"store" "enum__projects_v_version_links_store_store",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_profiles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_profiles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_overrides_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"profile" "enum__projects_v_version_overrides_profile",
  	"title" varchar,
  	"summary" varchar,
  	"order" numeric,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_role" varchar,
  	"version_team" varchar,
  	"version_period_start" timestamp(3) with time zone,
  	"version_period_end" timestamp(3) with time zone,
  	"version_links_repo" varchar,
  	"version_links_live" varchar,
  	"version_links_video" varchar,
  	"version_demo_status" "enum__projects_v_version_demo_status",
  	"version_confidentiality" "enum__projects_v_version_confidentiality" DEFAULT 'restricted',
  	"version_kind" "enum__projects_v_version_kind",
  	"version_employer" varchar,
  	"version__seed" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tech_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "posts_profiles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_posts_profiles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"site" "enum_posts_site",
  	"type" "enum_posts_type",
  	"body" jsonb,
  	"cover_id" integer,
  	"youtube_url" varchar,
  	"series" varchar,
  	"published_at" timestamp(3) with time zone,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_posts_v_version_profiles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__posts_v_version_profiles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_posts_v_version_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_site" "enum__posts_v_version_site",
  	"version_type" "enum__posts_v_version_type",
  	"version_body" jsonb,
  	"version_cover_id" integer,
  	"version_youtube_url" varchar,
  	"version_series" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version__seed" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "services_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"typical_timeline" varchar,
  	"order" numeric,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_services_v_version_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_typical_timeline" varchar,
  	"version_order" numeric,
  	"version__seed" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar,
  	"project_id" integer,
  	"consent_confirmed" boolean DEFAULT false,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_quote" varchar,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_company" varchar,
  	"version_project_id" integer,
  	"version_consent_confirmed" boolean DEFAULT false,
  	"version__seed" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"profile" "enum_inquiries_profile" NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"project_type" varchar,
  	"message" varchar NOT NULL,
  	"timeline" varchar,
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "experience_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "experience_variants" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_experience_variants",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "experience" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"employer" varchar NOT NULL,
  	"employer_detail" varchar,
  	"location" varchar,
  	"period_start" timestamp(3) with time zone,
  	"period_end" timestamp(3) with time zone,
  	"order" numeric,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "education_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "education_variants" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_education_variants",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "education" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"institution" varchar NOT NULL,
  	"degree" varchar NOT NULL,
  	"field" varchar,
  	"location" varchar,
  	"period_start" timestamp(3) with time zone,
  	"period_end" timestamp(3) with time zone,
  	"order" numeric,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "skills_variants" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_skills_variants",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" varchar NOT NULL,
  	"order" numeric,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tech" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"kind" "enum_tech_kind" NOT NULL,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_w480_url" varchar,
  	"sizes_w480_width" numeric,
  	"sizes_w480_height" numeric,
  	"sizes_w480_mime_type" varchar,
  	"sizes_w480_filesize" numeric,
  	"sizes_w480_filename" varchar,
  	"sizes_w768_url" varchar,
  	"sizes_w768_width" numeric,
  	"sizes_w768_height" numeric,
  	"sizes_w768_mime_type" varchar,
  	"sizes_w768_filesize" numeric,
  	"sizes_w768_filename" varchar,
  	"sizes_w1280_url" varchar,
  	"sizes_w1280_width" numeric,
  	"sizes_w1280_height" numeric,
  	"sizes_w1280_mime_type" varchar,
  	"sizes_w1280_filesize" numeric,
  	"sizes_w1280_filename" varchar,
  	"sizes_w1920_url" varchar,
  	"sizes_w1920_width" numeric,
  	"sizes_w1920_height" numeric,
  	"sizes_w1920_mime_type" varchar,
  	"sizes_w1920_filesize" numeric,
  	"sizes_w1920_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'reviewer' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"posts_id" integer,
  	"services_id" integer,
  	"testimonials_id" integer,
  	"inquiries_id" integer,
  	"experience_id" integer,
  	"education_id" integer,
  	"skills_id" integer,
  	"tech_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "person_headlines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "person_contact_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "person" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"location" varchar,
  	"about" jsonb,
  	"_seed" boolean DEFAULT false,
  	"_status" "enum_person_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_person_v_version_headlines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_person_v_version_contact_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_person_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar,
  	"version_location" varchar,
  	"version_about" jsonb,
  	"version__seed" boolean DEFAULT false,
  	"version__status" "enum__person_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "profiles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"root_enabled" boolean DEFAULT false,
  	"root_title" varchar,
  	"root_tagline" varchar,
  	"root_theme_key" varchar DEFAULT 'root',
  	"root_seo_title" varchar,
  	"root_seo_description" varchar,
  	"root_primary_action_label" varchar,
  	"root_primary_action_url" varchar,
  	"flutter_enabled" boolean DEFAULT false,
  	"flutter_title" varchar,
  	"flutter_tagline" varchar,
  	"flutter_theme_key" varchar DEFAULT 'flutter',
  	"flutter_seo_title" varchar,
  	"flutter_seo_description" varchar,
  	"flutter_primary_action_label" varchar,
  	"flutter_primary_action_url" varchar,
  	"product_enabled" boolean DEFAULT false,
  	"product_title" varchar,
  	"product_tagline" varchar,
  	"product_theme_key" varchar DEFAULT 'product',
  	"product_seo_title" varchar,
  	"product_seo_description" varchar,
  	"product_primary_action_label" varchar,
  	"product_primary_action_url" varchar,
  	"freelance_enabled" boolean DEFAULT false,
  	"freelance_title" varchar,
  	"freelance_tagline" varchar,
  	"freelance_theme_key" varchar DEFAULT 'freelance',
  	"freelance_seo_title" varchar,
  	"freelance_seo_description" varchar,
  	"freelance_primary_action_label" varchar,
  	"freelance_primary_action_url" varchar,
  	"fullstack_enabled" boolean DEFAULT false,
  	"fullstack_title" varchar,
  	"fullstack_tagline" varchar,
  	"fullstack_theme_key" varchar DEFAULT 'fullstack',
  	"fullstack_seo_title" varchar,
  	"fullstack_seo_description" varchar,
  	"fullstack_primary_action_label" varchar,
  	"fullstack_primary_action_url" varchar,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "brand_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"domain" varchar,
  	"voice_notes" varchar,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"analytics_token" varchar,
  	"_seed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "projects_platforms" ADD CONSTRAINT "projects_platforms_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_links_store" ADD CONSTRAINT "projects_links_store_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_metrics" ADD CONSTRAINT "projects_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_profiles" ADD CONSTRAINT "projects_profiles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_overrides_highlights" ADD CONSTRAINT "projects_overrides_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_overrides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_overrides" ADD CONSTRAINT "projects_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_tech_fk" FOREIGN KEY ("tech_id") REFERENCES "public"."tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_platforms" ADD CONSTRAINT "_projects_v_version_platforms_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_links_store" ADD CONSTRAINT "_projects_v_version_links_store_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_metrics" ADD CONSTRAINT "_projects_v_version_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_profiles" ADD CONSTRAINT "_projects_v_version_profiles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_overrides_highlights" ADD CONSTRAINT "_projects_v_version_overrides_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_overrides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_overrides" ADD CONSTRAINT "_projects_v_version_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_tech_fk" FOREIGN KEY ("tech_id") REFERENCES "public"."tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_profiles" ADD CONSTRAINT "posts_profiles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_references" ADD CONSTRAINT "posts_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_profiles" ADD CONSTRAINT "_posts_v_version_profiles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_references" ADD CONSTRAINT "_posts_v_version_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_deliverables" ADD CONSTRAINT "services_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_deliverables" ADD CONSTRAINT "_services_v_version_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experience_highlights" ADD CONSTRAINT "experience_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experience_variants" ADD CONSTRAINT "experience_variants_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_highlights" ADD CONSTRAINT "education_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_variants" ADD CONSTRAINT "education_variants_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_variants" ADD CONSTRAINT "skills_variants_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experience_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_fk" FOREIGN KEY ("education_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tech_fk" FOREIGN KEY ("tech_id") REFERENCES "public"."tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "person_headlines" ADD CONSTRAINT "person_headlines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "person_contact_links" ADD CONSTRAINT "person_contact_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_person_v_version_headlines" ADD CONSTRAINT "_person_v_version_headlines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_person_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_person_v_version_contact_links" ADD CONSTRAINT "_person_v_version_contact_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_person_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_links" ADD CONSTRAINT "site_settings_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_platforms_order_idx" ON "projects_platforms" USING btree ("order");
  CREATE INDEX "projects_platforms_parent_idx" ON "projects_platforms" USING btree ("parent_id");
  CREATE INDEX "projects_links_store_order_idx" ON "projects_links_store" USING btree ("_order");
  CREATE INDEX "projects_links_store_parent_id_idx" ON "projects_links_store" USING btree ("_parent_id");
  CREATE INDEX "projects_metrics_order_idx" ON "projects_metrics" USING btree ("_order");
  CREATE INDEX "projects_metrics_parent_id_idx" ON "projects_metrics" USING btree ("_parent_id");
  CREATE INDEX "projects_profiles_order_idx" ON "projects_profiles" USING btree ("order");
  CREATE INDEX "projects_profiles_parent_idx" ON "projects_profiles" USING btree ("parent_id");
  CREATE INDEX "projects_overrides_highlights_order_idx" ON "projects_overrides_highlights" USING btree ("_order");
  CREATE INDEX "projects_overrides_highlights_parent_id_idx" ON "projects_overrides_highlights" USING btree ("_parent_id");
  CREATE INDEX "projects_overrides_order_idx" ON "projects_overrides" USING btree ("_order");
  CREATE INDEX "projects_overrides_parent_id_idx" ON "projects_overrides" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects__seed_idx" ON "projects" USING btree ("_seed");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_tech_id_idx" ON "projects_rels" USING btree ("tech_id");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_version_platforms_order_idx" ON "_projects_v_version_platforms" USING btree ("order");
  CREATE INDEX "_projects_v_version_platforms_parent_idx" ON "_projects_v_version_platforms" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_links_store_order_idx" ON "_projects_v_version_links_store" USING btree ("_order");
  CREATE INDEX "_projects_v_version_links_store_parent_id_idx" ON "_projects_v_version_links_store" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_metrics_order_idx" ON "_projects_v_version_metrics" USING btree ("_order");
  CREATE INDEX "_projects_v_version_metrics_parent_id_idx" ON "_projects_v_version_metrics" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_profiles_order_idx" ON "_projects_v_version_profiles" USING btree ("order");
  CREATE INDEX "_projects_v_version_profiles_parent_idx" ON "_projects_v_version_profiles" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_overrides_highlights_order_idx" ON "_projects_v_version_overrides_highlights" USING btree ("_order");
  CREATE INDEX "_projects_v_version_overrides_highlights_parent_id_idx" ON "_projects_v_version_overrides_highlights" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_overrides_order_idx" ON "_projects_v_version_overrides" USING btree ("_order");
  CREATE INDEX "_projects_v_version_overrides_parent_id_idx" ON "_projects_v_version_overrides" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version__seed_idx" ON "_projects_v" USING btree ("version__seed");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_tech_id_idx" ON "_projects_v_rels" USING btree ("tech_id");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "posts_profiles_order_idx" ON "posts_profiles" USING btree ("order");
  CREATE INDEX "posts_profiles_parent_idx" ON "posts_profiles" USING btree ("parent_id");
  CREATE INDEX "posts_references_order_idx" ON "posts_references" USING btree ("_order");
  CREATE INDEX "posts_references_parent_id_idx" ON "posts_references" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts__seed_idx" ON "posts" USING btree ("_seed");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_texts_order_parent" ON "posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_version_profiles_order_idx" ON "_posts_v_version_profiles" USING btree ("order");
  CREATE INDEX "_posts_v_version_profiles_parent_idx" ON "_posts_v_version_profiles" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_references_order_idx" ON "_posts_v_version_references" USING btree ("_order");
  CREATE INDEX "_posts_v_version_references_parent_id_idx" ON "_posts_v_version_references" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version__seed_idx" ON "_posts_v" USING btree ("version__seed");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_texts_order_parent" ON "_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "services_deliverables_order_idx" ON "services_deliverables" USING btree ("_order");
  CREATE INDEX "services_deliverables_parent_id_idx" ON "services_deliverables" USING btree ("_parent_id");
  CREATE INDEX "services__seed_idx" ON "services" USING btree ("_seed");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "_services_v_version_deliverables_order_idx" ON "_services_v_version_deliverables" USING btree ("_order");
  CREATE INDEX "_services_v_version_deliverables_parent_id_idx" ON "_services_v_version_deliverables" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version__seed_idx" ON "_services_v" USING btree ("version__seed");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "testimonials_project_idx" ON "testimonials" USING btree ("project_id");
  CREATE INDEX "testimonials__seed_idx" ON "testimonials" USING btree ("_seed");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_project_idx" ON "_testimonials_v" USING btree ("version_project_id");
  CREATE INDEX "_testimonials_v_version_version__seed_idx" ON "_testimonials_v" USING btree ("version__seed");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "inquiries__seed_idx" ON "inquiries" USING btree ("_seed");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "experience_highlights_order_idx" ON "experience_highlights" USING btree ("_order");
  CREATE INDEX "experience_highlights_parent_id_idx" ON "experience_highlights" USING btree ("_parent_id");
  CREATE INDEX "experience_variants_order_idx" ON "experience_variants" USING btree ("order");
  CREATE INDEX "experience_variants_parent_idx" ON "experience_variants" USING btree ("parent_id");
  CREATE INDEX "experience__seed_idx" ON "experience" USING btree ("_seed");
  CREATE INDEX "experience_updated_at_idx" ON "experience" USING btree ("updated_at");
  CREATE INDEX "experience_created_at_idx" ON "experience" USING btree ("created_at");
  CREATE INDEX "education_highlights_order_idx" ON "education_highlights" USING btree ("_order");
  CREATE INDEX "education_highlights_parent_id_idx" ON "education_highlights" USING btree ("_parent_id");
  CREATE INDEX "education_variants_order_idx" ON "education_variants" USING btree ("order");
  CREATE INDEX "education_variants_parent_idx" ON "education_variants" USING btree ("parent_id");
  CREATE INDEX "education__seed_idx" ON "education" USING btree ("_seed");
  CREATE INDEX "education_updated_at_idx" ON "education" USING btree ("updated_at");
  CREATE INDEX "education_created_at_idx" ON "education" USING btree ("created_at");
  CREATE INDEX "skills_variants_order_idx" ON "skills_variants" USING btree ("order");
  CREATE INDEX "skills_variants_parent_idx" ON "skills_variants" USING btree ("parent_id");
  CREATE INDEX "skills__seed_idx" ON "skills" USING btree ("_seed");
  CREATE INDEX "skills_updated_at_idx" ON "skills" USING btree ("updated_at");
  CREATE INDEX "skills_created_at_idx" ON "skills" USING btree ("created_at");
  CREATE UNIQUE INDEX "tech_name_idx" ON "tech" USING btree ("name");
  CREATE INDEX "tech__seed_idx" ON "tech" USING btree ("_seed");
  CREATE INDEX "tech_updated_at_idx" ON "tech" USING btree ("updated_at");
  CREATE INDEX "tech_created_at_idx" ON "tech" USING btree ("created_at");
  CREATE INDEX "media__seed_idx" ON "media" USING btree ("_seed");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_w480_sizes_w480_filename_idx" ON "media" USING btree ("sizes_w480_filename");
  CREATE INDEX "media_sizes_w768_sizes_w768_filename_idx" ON "media" USING btree ("sizes_w768_filename");
  CREATE INDEX "media_sizes_w1280_sizes_w1280_filename_idx" ON "media" USING btree ("sizes_w1280_filename");
  CREATE INDEX "media_sizes_w1920_sizes_w1920_filename_idx" ON "media" USING btree ("sizes_w1920_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_experience_id_idx" ON "payload_locked_documents_rels" USING btree ("experience_id");
  CREATE INDEX "payload_locked_documents_rels_education_id_idx" ON "payload_locked_documents_rels" USING btree ("education_id");
  CREATE INDEX "payload_locked_documents_rels_skills_id_idx" ON "payload_locked_documents_rels" USING btree ("skills_id");
  CREATE INDEX "payload_locked_documents_rels_tech_id_idx" ON "payload_locked_documents_rels" USING btree ("tech_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "person_headlines_order_idx" ON "person_headlines" USING btree ("_order");
  CREATE INDEX "person_headlines_parent_id_idx" ON "person_headlines" USING btree ("_parent_id");
  CREATE INDEX "person_contact_links_order_idx" ON "person_contact_links" USING btree ("_order");
  CREATE INDEX "person_contact_links_parent_id_idx" ON "person_contact_links" USING btree ("_parent_id");
  CREATE INDEX "person__seed_idx" ON "person" USING btree ("_seed");
  CREATE INDEX "person__status_idx" ON "person" USING btree ("_status");
  CREATE INDEX "_person_v_version_headlines_order_idx" ON "_person_v_version_headlines" USING btree ("_order");
  CREATE INDEX "_person_v_version_headlines_parent_id_idx" ON "_person_v_version_headlines" USING btree ("_parent_id");
  CREATE INDEX "_person_v_version_contact_links_order_idx" ON "_person_v_version_contact_links" USING btree ("_order");
  CREATE INDEX "_person_v_version_contact_links_parent_id_idx" ON "_person_v_version_contact_links" USING btree ("_parent_id");
  CREATE INDEX "_person_v_version_version__seed_idx" ON "_person_v" USING btree ("version__seed");
  CREATE INDEX "_person_v_version_version__status_idx" ON "_person_v" USING btree ("version__status");
  CREATE INDEX "_person_v_created_at_idx" ON "_person_v" USING btree ("created_at");
  CREATE INDEX "_person_v_updated_at_idx" ON "_person_v" USING btree ("updated_at");
  CREATE INDEX "_person_v_latest_idx" ON "_person_v" USING btree ("latest");
  CREATE INDEX "profiles__seed_idx" ON "profiles" USING btree ("_seed");
  CREATE INDEX "brand_settings__seed_idx" ON "brand_settings" USING btree ("_seed");
  CREATE INDEX "site_settings_footer_links_order_idx" ON "site_settings_footer_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_links_parent_id_idx" ON "site_settings_footer_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings__seed_idx" ON "site_settings" USING btree ("_seed");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_platforms" CASCADE;
  DROP TABLE "projects_links_store" CASCADE;
  DROP TABLE "projects_metrics" CASCADE;
  DROP TABLE "projects_profiles" CASCADE;
  DROP TABLE "projects_overrides_highlights" CASCADE;
  DROP TABLE "projects_overrides" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_platforms" CASCADE;
  DROP TABLE "_projects_v_version_links_store" CASCADE;
  DROP TABLE "_projects_v_version_metrics" CASCADE;
  DROP TABLE "_projects_v_version_profiles" CASCADE;
  DROP TABLE "_projects_v_version_overrides_highlights" CASCADE;
  DROP TABLE "_projects_v_version_overrides" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "posts_profiles" CASCADE;
  DROP TABLE "posts_references" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_texts" CASCADE;
  DROP TABLE "_posts_v_version_profiles" CASCADE;
  DROP TABLE "_posts_v_version_references" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_texts" CASCADE;
  DROP TABLE "services_deliverables" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v_version_deliverables" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "experience_highlights" CASCADE;
  DROP TABLE "experience_variants" CASCADE;
  DROP TABLE "experience" CASCADE;
  DROP TABLE "education_highlights" CASCADE;
  DROP TABLE "education_variants" CASCADE;
  DROP TABLE "education" CASCADE;
  DROP TABLE "skills_variants" CASCADE;
  DROP TABLE "skills" CASCADE;
  DROP TABLE "tech" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "person_headlines" CASCADE;
  DROP TABLE "person_contact_links" CASCADE;
  DROP TABLE "person" CASCADE;
  DROP TABLE "_person_v_version_headlines" CASCADE;
  DROP TABLE "_person_v_version_contact_links" CASCADE;
  DROP TABLE "_person_v" CASCADE;
  DROP TABLE "profiles" CASCADE;
  DROP TABLE "brand_settings" CASCADE;
  DROP TABLE "site_settings_footer_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_projects_platforms";
  DROP TYPE "public"."enum_projects_links_store_store";
  DROP TYPE "public"."enum_projects_profiles";
  DROP TYPE "public"."enum_projects_overrides_profile";
  DROP TYPE "public"."enum_projects_demo_status";
  DROP TYPE "public"."enum_projects_confidentiality";
  DROP TYPE "public"."enum_projects_kind";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_platforms";
  DROP TYPE "public"."enum__projects_v_version_links_store_store";
  DROP TYPE "public"."enum__projects_v_version_profiles";
  DROP TYPE "public"."enum__projects_v_version_overrides_profile";
  DROP TYPE "public"."enum__projects_v_version_demo_status";
  DROP TYPE "public"."enum__projects_v_version_confidentiality";
  DROP TYPE "public"."enum__projects_v_version_kind";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_posts_profiles";
  DROP TYPE "public"."enum_posts_site";
  DROP TYPE "public"."enum_posts_type";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_profiles";
  DROP TYPE "public"."enum__posts_v_version_site";
  DROP TYPE "public"."enum__posts_v_version_type";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum_inquiries_profile";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_experience_variants";
  DROP TYPE "public"."enum_education_variants";
  DROP TYPE "public"."enum_skills_variants";
  DROP TYPE "public"."enum_tech_kind";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_person_status";
  DROP TYPE "public"."enum__person_v_version_status";`)
}
