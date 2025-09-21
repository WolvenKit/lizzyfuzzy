CREATE TABLE
  IF NOT EXISTS "quotes" (
    "id" INTEGER PRIMARY KEY,
    "quote" TEXT NOT NULL,
    "responde" TEXT NOT NULL,
    "server" TEXT NOT NULL
  );