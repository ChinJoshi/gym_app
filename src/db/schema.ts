import {
    pgTable,
    uuid,
    varchar,
    integer,
    doublePrecision,
    timestamp,
    unique,
    boolean,
    interval,
} from "drizzle-orm/pg-core";
import { users } from "@/db/auth.schema";

// TODO: add profiles table

// --- public.plans ---
export const plans = pgTable("plans", {
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
    is_custom: boolean("is_custom").default(false),
    user_id: uuid("user_id").references(() => users.id),
    // add muscle group, equipment, etc. as needed
});

// --- public.planned_exercises (join) ---
export const planned_exercises = pgTable(
    "planned_exercises",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        plan_id: uuid("plan_id")
            .notNull()
            .references(() => plans.id),
        exercise_id: uuid("exercise_id")
            .notNull()
            .references(() => exercises.id),
        sort_order: integer("sort_order").notNull(),
    },
    (t) => [unique().on(t.plan_id, t.sort_order)]
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

// --- public.sessions ---
export const sessions = pgTable("sessions", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.id),
    plan_id: uuid("plan_id")
        .notNull()
        .references(() => plans.id),
    started_at: timestamp("started_at").defaultNow().notNull(),
    completed_at: timestamp("completed_at"),
    duration: interval("duration")
});

// --- public.completed_exercises ---
export const completed_exercises = pgTable(
    "completed_exercises",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        session_id: uuid("session_id")
            .notNull()
            .references(() => sessions.id),
        exercise_id: uuid("exercise_id")
            .notNull()
            .references(() => exercises.id),
        sort_order: integer("sort_order").notNull(),
    },
    (t) => [unique().on(t.session_id, t.sort_order)]
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