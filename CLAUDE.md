# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

-   Build: `npm run build`
-   Dev server: `npm run dev --turbopack`
-   Lint: `npm run lint`
-   Database:
    -   Generate: `npm run db:generate`
    -   Migrate: `npm run db:migrate`
    -   Studio UI: `npm run db:studio`

## Code Style

-   TypeScript with strict mode enabled
-   ESLint with Next.js core-web-vitals configuration
-   Path aliasing: use `@/` imports (e.g., `@/components/ui/button`)
-   Component library: shadcn/ui with "new-york" style
-   CSS: Tailwind with component composition pattern
-   File structure follows Next.js App Router conventions
-   Database: Drizzle ORM with Supabase
-   Authentication: NextAuth.js v5 (Auth.js)
-   Form validation: Zod

## Naming Conventions

-   React components: PascalCase
-   Functions/variables: camelCase
-   Types/interfaces: PascalCase with descriptive names
-   Database schema: snake_case for tables, camelCase for queries
