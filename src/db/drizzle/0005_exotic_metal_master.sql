ALTER TABLE "sessions"
ALTER COLUMN "duration" SET DATA TYPE interval
USING ("duration" * interval '1 second');