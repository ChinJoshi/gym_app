CREATE TABLE "completed_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"completed_workout_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "completed_exercises_completed_workout_id_sort_order_unique" UNIQUE("completed_workout_id","sort_order")
);
--> statement-breakpoint
CREATE TABLE "completed_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"completed_exercise_id" uuid NOT NULL,
	"weight" double precision,
	"duration" integer,
	"reps" integer NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "completed_sets_completed_exercise_id_sort_order_unique" UNIQUE("completed_exercise_id","sort_order")
);
--> statement-breakpoint
CREATE TABLE "completed_workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"routine_id" uuid NOT NULL,
	"performed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"muscle_group" varchar,
	"equipment" varchar
);
--> statement-breakpoint
CREATE TABLE "planned_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"routine_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "planned_exercises_routine_id_sort_order_unique" UNIQUE("routine_id","sort_order")
);
--> statement-breakpoint
CREATE TABLE "planned_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"planned_exercise_id" uuid NOT NULL,
	"weight" double precision,
	"duration" integer,
	"reps" integer NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "planned_sets_planned_exercise_id_sort_order_unique" UNIQUE("planned_exercise_id","sort_order")
);
--> statement-breakpoint
CREATE TABLE "routines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "completed_exercises" ADD CONSTRAINT "completed_exercises_completed_workout_id_completed_workouts_id_fk" FOREIGN KEY ("completed_workout_id") REFERENCES "public"."completed_workouts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "completed_exercises" ADD CONSTRAINT "completed_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "completed_sets" ADD CONSTRAINT "completed_sets_completed_exercise_id_completed_exercises_id_fk" FOREIGN KEY ("completed_exercise_id") REFERENCES "public"."completed_exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "completed_workouts" ADD CONSTRAINT "completed_workouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "completed_workouts" ADD CONSTRAINT "completed_workouts_routine_id_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planned_exercises" ADD CONSTRAINT "planned_exercises_routine_id_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planned_exercises" ADD CONSTRAINT "planned_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planned_sets" ADD CONSTRAINT "planned_sets_planned_exercise_id_planned_exercises_id_fk" FOREIGN KEY ("planned_exercise_id") REFERENCES "public"."planned_exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routines" ADD CONSTRAINT "routines_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;