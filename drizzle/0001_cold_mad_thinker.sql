CREATE TYPE "public"."position_stance" AS ENUM('agree', 'disagree');--> statement-breakpoint
CREATE TYPE "public"."resolution_outcome" AS ENUM('correct', 'incorrect', 'void');--> statement-breakpoint
CREATE TYPE "public"."take_kind" AS ENUM('objective', 'subjective');--> statement-breakpoint
CREATE TABLE "boosts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"take_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug"),
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"take_id" text NOT NULL,
	"stance" "position_stance" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "pundit_follows" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"pundit_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "pundits" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"url" text,
	"description" text,
	"image" text,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "pundits_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "resolutions" (
	"id" text PRIMARY KEY NOT NULL,
	"take_id" text NOT NULL,
	"outcome" "resolution_outcome" NOT NULL,
	"notes" text,
	"source" text,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "take_categories" (
	"take_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "take_categories_take_id_category_id_pk" PRIMARY KEY("take_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "takes" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"pundit_id" text NOT NULL,
	"headline" text NOT NULL,
	"details" text,
	"kind" "take_kind" NOT NULL,
	"source" text,
	"stated_at" timestamp NOT NULL,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "takes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "boosts" ADD CONSTRAINT "boosts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boosts" ADD CONSTRAINT "boosts_take_id_takes_id_fk" FOREIGN KEY ("take_id") REFERENCES "public"."takes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_take_id_takes_id_fk" FOREIGN KEY ("take_id") REFERENCES "public"."takes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pundit_follows" ADD CONSTRAINT "pundit_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pundit_follows" ADD CONSTRAINT "pundit_follows_pundit_id_pundits_id_fk" FOREIGN KEY ("pundit_id") REFERENCES "public"."pundits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pundits" ADD CONSTRAINT "pundits_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolutions" ADD CONSTRAINT "resolutions_take_id_takes_id_fk" FOREIGN KEY ("take_id") REFERENCES "public"."takes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolutions" ADD CONSTRAINT "resolutions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "take_categories" ADD CONSTRAINT "take_categories_take_id_takes_id_fk" FOREIGN KEY ("take_id") REFERENCES "public"."takes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "take_categories" ADD CONSTRAINT "take_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "takes" ADD CONSTRAINT "takes_pundit_id_pundits_id_fk" FOREIGN KEY ("pundit_id") REFERENCES "public"."pundits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "takes" ADD CONSTRAINT "takes_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "boosts_userId_takeId_idx" ON "boosts" USING btree ("user_id","take_id");--> statement-breakpoint
CREATE INDEX "positions_userId_takeId_idx" ON "positions" USING btree ("user_id","take_id");--> statement-breakpoint
CREATE INDEX "pundit_follows_userId_punditId_idx" ON "pundit_follows" USING btree ("user_id","pundit_id");--> statement-breakpoint
CREATE INDEX "pundit_follows_punditId_idx" ON "pundit_follows" USING btree ("pundit_id");--> statement-breakpoint
CREATE INDEX "pundits_createdByUserId_idx" ON "pundits" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "resolutions_takeId_idx" ON "resolutions" USING btree ("take_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resolutions_takeId_active_idx" ON "resolutions" USING btree ("take_id") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "takes_punditId_idx" ON "takes" USING btree ("pundit_id");--> statement-breakpoint
CREATE INDEX "takes_createdByUserId_idx" ON "takes" USING btree ("created_by_user_id");