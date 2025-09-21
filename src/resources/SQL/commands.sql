CREATE TABLE
  IF NOT EXISTS "commands" (
    "id" INTEGER PRIMARY KEY,
    "isEmbed" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL
  );