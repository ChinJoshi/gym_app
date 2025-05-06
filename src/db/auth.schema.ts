import {
    pgSchema,
    uuid,
    timestamp,
    PgTimestampConfig,
    varchar,
} from "drizzle-orm/pg-core";

// --- auth.users (external schema) ---
const authSchema = pgSchema("auth");
export const users = authSchema.table("users", {
    id: uuid("id").primaryKey(),
    email: varchar("email", { length: 255 }),
    email_confirmed_at: timestamp("email_confirmed_at", {
        withTimezone: true,
    } satisfies PgTimestampConfig),
});
