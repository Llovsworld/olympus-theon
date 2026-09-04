BEGIN;

ALTER TABLE "Post"
ADD COLUMN IF NOT EXISTS "categories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "Post"
SET "categories" = ARRAY["category"]
WHERE "category" IS NOT NULL
  AND BTRIM("category") <> ''
  AND CARDINALITY("categories") = 0;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Post"
    WHERE "category" IS NOT NULL
      AND BTRIM("category") <> ''
      AND CARDINALITY("categories") = 0
  ) THEN
    RAISE EXCEPTION 'Some legacy post categories were not migrated';
  END IF;
END $$;

COMMIT;
