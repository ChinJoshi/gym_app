ALTER TABLE "completed_workouts" RENAME TO "completed_sessions";--> statement-breakpoint
ALTER TABLE "routines" RENAME TO "plans";--> statement-breakpoint
ALTER TABLE "completed_exercises" RENAME COLUMN "completed_workout_id" TO "completed_session_id";--> statement-breakpoint
ALTER TABLE "completed_sessions" RENAME COLUMN "routine_id" TO "plan_id";--> statement-breakpoint
ALTER TABLE "planned_exercises" RENAME COLUMN "routine_id" TO "plan_id";--> statement-breakpoint
ALTER TABLE "completed_exercises" DROP CONSTRAINT "completed_exercises_completed_workout_id_sort_order_unique";--> statement-breakpoint
ALTER TABLE "planned_exercises" DROP CONSTRAINT "planned_exercises_routine_id_sort_order_unique";--> statement-breakpoint
ALTER TABLE "completed_exercises" DROP CONSTRAINT "completed_exercises_completed_workout_id_completed_workouts_id_fk";
--> statement-breakpoint
ALTER TABLE "completed_sessions" DROP CONSTRAINT "completed_workouts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "completed_sessions" DROP CONSTRAINT "completed_workouts_routine_id_routines_id_fk";
--> statement-breakpoint
ALTER TABLE "planned_exercises" DROP CONSTRAINT "planned_exercises_routine_id_routines_id_fk";
--> statement-breakpoint
ALTER TABLE "plans" DROP CONSTRAINT "routines_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "completed_exercises" ADD CONSTRAINT "completed_exercises_completed_session_id_completed_sessions_id_fk" FOREIGN KEY ("completed_session_id") REFERENCES "public"."completed_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "completed_sessions" ADD CONSTRAINT "completed_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "completed_sessions" ADD CONSTRAINT "completed_sessions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planned_exercises" ADD CONSTRAINT "planned_exercises_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "completed_exercises" ADD CONSTRAINT "completed_exercises_completed_session_id_sort_order_unique" UNIQUE("completed_session_id","sort_order");--> statement-breakpoint
ALTER TABLE "planned_exercises" ADD CONSTRAINT "planned_exercises_plan_id_sort_order_unique" UNIQUE("plan_id","sort_order");