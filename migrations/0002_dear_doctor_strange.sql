CREATE TABLE "session" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;