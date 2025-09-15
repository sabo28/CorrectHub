ALTER TABLE "report" ADD COLUMN "isAnonym" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "report" DROP COLUMN "userName";