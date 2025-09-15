CREATE TABLE "attachment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"reportId" uuid NOT NULL,
	"createdBy" uuid NOT NULL,
	"mime" text NOT NULL,
	"data" "bytea" NOT NULL,
	"preview" "bytea" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_reportId_report_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."report"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;