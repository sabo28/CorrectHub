CREATE TABLE "comment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"reportId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"isAnonym" boolean DEFAULT false NOT NULL,
	"text" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_reportId_report_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."report"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;