BEGIN;

UPDATE "Book"
SET "link" = 'https://amzn.to/4xtvQbT'
WHERE "slug" = 'siete-reglas-de-oro-para-vivir-en-pareja-gottman';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "Book"
    WHERE "slug" = 'siete-reglas-de-oro-para-vivir-en-pareja-gottman'
      AND "link" = 'https://amzn.to/4xtvQbT'
  ) THEN
    RAISE EXCEPTION 'The Gottman affiliate link was not applied to the expected book';
  END IF;
END $$;

COMMIT;
