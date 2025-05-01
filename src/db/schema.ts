import {
    pgTable,
    uuid,
    varchar,
    integer,
    doublePrecision,
    timestamp,
    unique,
    boolean,
} from "drizzle-orm/pg-core";
import { users } from "@/db/auth.schema";

// TODO: change the name of "workouts" to "sessions"
// TODO: add profiles table

// --- public.routines ---
export const routines = pgTable("routines", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.id),
    name: varchar("name", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

// --- public.exercises (catalog) ---
export const exercises = pgTable("exercises", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    muscle_group: varchar("muscle_group"),
    equipment: varchar("equipment"),
    isCustom: boolean("isCustom").default(false),
    user_id: uuid("user_id").references(() => users.id),
    // add muscle group, equipment, etc. as needed
});

// --- public.planned_exercises (join) ---
export const planned_exercises = pgTable(
    "planned_exercises",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        routine_id: uuid("routine_id")
            .notNull()
            .references(() => routines.id),
        exercise_id: uuid("exercise_id")
            .notNull()
            .references(() => exercises.id),
        sort_order: integer("sort_order").notNull(),
    },
    (t) => [unique().on(t.routine_id, t.sort_order)]
);

// --- public.planned_sets ---
export const planned_sets = pgTable(
    "planned_sets",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        planned_exercise_id: uuid("planned_exercise_id")
            .notNull()
            .references(() => planned_exercises.id),
        weight: doublePrecision("weight"),
        duration: integer("duration"),
        reps: integer("reps").notNull(),
        sort_order: integer("sort_order").notNull(),
    },
    (t) => [unique().on(t.planned_exercise_id, t.sort_order)]
);

// --- public.completed_workouts ---
export const completed_workouts = pgTable("completed_workouts", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.id),
    routine_id: uuid("routine_id")
        .notNull()
        .references(() => routines.id),
    performed_at: timestamp("performed_at").defaultNow().notNull(),
});

// --- public.completed_exercises ---
export const completed_exercises = pgTable(
    "completed_exercises",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        completed_workout_id: uuid("completed_workout_id")
            .notNull()
            .references(() => completed_workouts.id),
        exercise_id: uuid("exercise_id")
            .notNull()
            .references(() => exercises.id),
        sort_order: integer("sort_order").notNull(),
    },
    (t) => [unique().on(t.completed_workout_id, t.sort_order)]
);

// --- public.completed_sets ---
export const completed_sets = pgTable(
    "completed_sets",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        completed_exercise_id: uuid("completed_exercise_id")
            .notNull()
            .references(() => completed_exercises.id),
        weight: doublePrecision("weight"),
        duration: integer("duration"),
        reps: integer("reps").notNull(),
        sort_order: integer("sort_order").notNull(),
    },
    (t) => [unique().on(t.completed_exercise_id, t.sort_order)]
);
