CREATE TABLE IF NOT EXISTS "commands" (
  "id" INTEGER PRIMARY KEY,
  "initiator" VARCHAR(255) NOT NULL,
  "textorjson" BOOLEAN NOT NULL,
  "command" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "settings" (
  "id" INTEGER PRIMARY KEY,
  "key" VARCHAR(255) NOT NULL,
  "value" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "markedMembers" (
  "id" INTEGER PRIMARY KEY,
  "user" VARCHAR(255) NOT NULL UNIQUE,
  "message" TEXT,
  "channel" VARCHAR(255) NOT NULL,
  "messageid" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "coremods" (
  "id" INTEGER PRIMARY KEY,
  "tagName" TEXT,
  "version" TEXT,
  "updatedat" TEXT,
  "url" TEXT
)
