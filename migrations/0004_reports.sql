CREATE TABLE "report" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"userName" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;