-- Apply once to the production PostgreSQL database before deploying the code
-- that requires newsletter confirmation and consent evidence.
ALTER TABLE "Subscriber"
    ADD COLUMN IF NOT EXISTS "consentAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "consentVersion" TEXT,
    ADD COLUMN IF NOT EXISTS "consentSource" TEXT,
    ADD COLUMN IF NOT EXISTS "confirmationTokenHash" TEXT,
    ADD COLUMN IF NOT EXISTS "confirmationExpiresAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "unsubscribedAt" TIMESTAMP(3);

ALTER TABLE "Subscriber"
    ALTER COLUMN "active" SET DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS "Subscriber_confirmationTokenHash_key"
    ON "Subscriber"("confirmationTokenHash");

-- Existing addresses have no recorded confirmation. Pause them until they
-- subscribe again and complete the double opt-in flow.
UPDATE "Subscriber"
SET "active" = false
WHERE "confirmedAt" IS NULL;
