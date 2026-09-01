BEGIN;

ALTER TABLE "Book"
ADD COLUMN IF NOT EXISTS "category" TEXT;

UPDATE "Book"
SET "category" = 'Relaciones'
WHERE "slug" = 'siete-reglas-de-oro-para-vivir-en-pareja-gottman'
  AND ("category" IS NULL OR BTRIM("category") = '');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Book"
    WHERE "slug" = 'siete-reglas-de-oro-para-vivir-en-pareja-gottman'
      AND "published" = TRUE
      AND "category" IS DISTINCT FROM 'Relaciones'
  ) THEN
    RAISE EXCEPTION 'The published Gottman book does not have the expected Relaciones category';
  END IF;
END $$;

COMMIT;
