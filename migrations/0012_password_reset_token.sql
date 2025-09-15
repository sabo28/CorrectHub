CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;