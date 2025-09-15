CREATE TABLE "report_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"reportId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"oldValues" jsonb NOT NULL,
	"newValues" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "report_events" ADD CONSTRAINT "report_events_reportId_report_id_fk" FOREIGN KEY ("reportId") REFERENCES "public"."report"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_events" ADD CONSTRAINT "report_events_actorId_user_id_fk" FOREIGN KEY ("actorId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "report_event_report_id_index" ON "report_events" USING btree ("reportId");--> statement-breakpoint
CREATE INDEX "report_event_created_at_index" ON "report_events" USING btree ("createdAt");