ALTER TABLE "completed_sessions" RENAME TO "sessions";--> statement-breakpoint
ALTER TABLE "completed_exercises" RENAME COLUMN "completed_session_id" TO "session_id";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "performed_at" TO "started_at";--> statement-breakpoint
ALTER TABLE "completed_exercises" DROP CONSTRAINT "completed_exercises_completed_session_id_sort_order_unique";--> statement-breakpoint
ALTER TABLE "completed_exercises" DROP CONSTRAINT "completed_exercises_completed_session_id_completed_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "completed_sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "completed_sessions_plan_id_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "completed_exercises" ADD CONSTRAINT "completed_exercises_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "completed_exercises" ADD CONSTRAINT "completed_exercises_session_id_sort_order_unique" UNIQUE("session_id","sort_order");