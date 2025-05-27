ALTER TABLE "completed_exercises" RENAME TO "session_exercises";--> statement-breakpoint
ALTER TABLE "completed_sets" RENAME TO "session_sets";--> statement-breakpoint
ALTER TABLE "session_sets" RENAME COLUMN "completed_exercise_id" TO "session_exercise_id";--> statement-breakpoint
ALTER TABLE "session_exercises" DROP CONSTRAINT "completed_exercises_session_id_sort_order_unique";--> statement-breakpoint
ALTER TABLE "session_sets" DROP CONSTRAINT "completed_sets_completed_exercise_id_sort_order_unique";--> statement-breakpoint
ALTER TABLE "session_exercises" DROP CONSTRAINT "completed_exercises_session_id_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "session_exercises" DROP CONSTRAINT "completed_exercises_exercise_id_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "session_sets" DROP CONSTRAINT "completed_sets_completed_exercise_id_completed_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "session_sets" ADD COLUMN "completed" boolean;--> statement-breakpoint
UPDATE session_sets SET completed = true WHERE completed IS NULL;--> statement-breakpoint
ALTER TABLE session_sets ALTER COLUMN completed SET NOT NULL;--> statement-breakpoint
ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_sets" ADD CONSTRAINT "session_sets_session_exercise_id_session_exercises_id_fk" FOREIGN KEY ("session_exercise_id") REFERENCES "public"."session_exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_exercises" ADD CONSTRAINT "session_exercises_session_id_sort_order_unique" UNIQUE("session_id","sort_order");--> statement-breakpoint
ALTER TABLE "session_sets" ADD CONSTRAINT "session_sets_session_exercise_id_sort_order_unique" UNIQUE("session_exercise_id","sort_order");