import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
    schema: "./src/db/schema.ts",
    out: "./src/db/drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
