CREATE TABLE "ai_learning_platform_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_learning_platform_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "ai_learning_platform_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "ai_learning_platform_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"username" text,
	"display_username" text,
	CONSTRAINT "ai_learning_platform_user_email_unique" UNIQUE("email"),
	CONSTRAINT "ai_learning_platform_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "ai_learning_platform_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "ai_learning_platform_account" ADD CONSTRAINT "ai_learning_platform_account_user_id_ai_learning_platform_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ai_learning_platform_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_learning_platform_session" ADD CONSTRAINT "ai_learning_platform_session_user_id_ai_learning_platform_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ai_learning_platform_user"("id") ON DELETE cascade ON UPDATE no action;