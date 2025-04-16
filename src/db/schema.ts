import {
    pgTable,
    varchar,
    doublePrecision,
    integer,
    timestamp,
    pgSchema,
    uuid,
} from "drizzle-orm/pg-core";

//this table will not be managed by drizzle kit since by default drizzle kit onyl manages pg tables in the public schema
const authSchema = pgSchema("auth");
const users = authSchema.table("users", {
    id: uuid("id").primaryKey(),
});

// routines consist of planned exercises
export const routines = pgTable("routines", {
    id: uuid().notNull().primaryKey(),
    name: varchar().notNull(),
});

// planned exercises consist of planned sets
export const planned_exercises = pgTable("planned_exercises", {
    id: uuid().notNull().primaryKey(),
    name: varchar().notNull(),
});

// planned sets consist of weights, reps, the planned exercise they're in, and at what order in the planned exercise they're in
export const planned_sets = pgTable("planned_sets", {
    id: uuid().notNull().primaryKey(),
    planned_exercise_id: varchar().references(() => planned_exercises.id),
    weight: doublePrecision().notNull(),
    reps: integer().notNull(),
    order: integer().notNull().unique(),
});

//routine exercises relates routines with exercises and the order that those exercises are in the routine
export const routine_exercises = pgTable("routine_exercises", {
    routine_id: uuid()
        .notNull()
        .references(() => routines.id),
    planned_exercise_id: uuid()
        .notNull()
        .references(() => planned_exercises.id),
    order: integer().notNull().unique(),
});

//
export const completed_sets = pgTable("completed_sets", {
    id: uuid().notNull().primaryKey(),
    planned_set_id: uuid()
        .notNull()
        .references(() => planned_sets.id),
    weight: doublePrecision().notNull(),
    reps: integer().notNull(),
});

export const completed_exercises = pgTable("completed_exercises", {
    id: uuid().notNull().primaryKey(),
    planned_exercise_id: uuid()
        .notNull()
        .references(() => planned_exercises.id),
});

export const completed_exercises_sets = pgTable("completed_exercises_sets", {
    completed_exercise_id: uuid()
        .notNull()
        .references(() => completed_exercises.id),
    completed_set_id: uuid()
        .notNull()
        .references(() => completed_sets.id),
});

export const completed_workouts_exercises = pgTable(
    "completed_workouts_exercises",
    {
        completed_workout_id: uuid()
            .notNull()
            .references(() => completed_workouts.id),
        completed_exercise_id: uuid()
            .notNull()
            .references(() => completed_exercises.id),
    }
);
//relates a user to a completed routine and the sets they did in that completed routine
export const completed_workouts = pgTable("completed_workouts", {
    id: uuid().notNull().primaryKey(),
    timestamp: timestamp().notNull(),
    routine_id: uuid()
        .notNull()
        .references(() => routines.id),
    user_id: uuid()
        .notNull()
        .references(() => users.id),
});
