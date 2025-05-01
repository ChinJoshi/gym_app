ALTER TABLE "exercises" ADD COLUMN "isCustom" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;