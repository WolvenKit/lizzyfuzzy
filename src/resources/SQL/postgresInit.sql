CREATE TABLE
    IF NOT EXISTS "commands" (
        "id" INTEGER PRIMARY KEY,
        "isEmbed" BOOLEAN NOT NULL,
        "name" TEXT NOT NULL,
        "content" TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS "quotes" (
        "id" INTEGER PRIMARY KEY,
        "quote" TEXT NOT NULL,
        "responde" TEXT NOT NULL,
        "server" TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS "commands" (
        "id" INTEGER PRIMARY KEY,
        "initiator" VARCHAR(255) NOT NULL,
        "textorjson" BOOLEAN NOT NULL,
        "command" TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS "settings" (
        "id" INTEGER PRIMARY KEY,
        "key" VARCHAR(255) NOT NULL,
        "value" TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS "markedMembers" (
        "id" INTEGER PRIMARY KEY,
        "user" VARCHAR(255) NOT NULL UNIQUE,
        "message" TEXT,
        "channel" VARCHAR(255) NOT NULL,
        "messageid" VARCHAR(255) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS "coremods" (
        "id" INTEGER PRIMARY KEY,
        "tagName" TEXT,
        "version" TEXT,
        "updatedat" TEXT,
        "url" TEXT
    )
CREATE TABLE
    IF NOT EXISTS "users" (
        "id" INTEGER PRIMARY KEY,
        "username" TEXT,
        "globalname" TEXT,
        "avatar" TEXT,
        "discordid" TEXT NOT NULL,
        "theme" TEXT NOT NULL DEFAULT 'default',
        "style" TEXT NOT NULL DEFAULT 'uppercase',
        "description" TEXT,
        "githubusername" TEXT,
        "nexusmodsusername" TEXT,
        "nexusmods" TEXT,
        "github" TEXT,
        "roles" TEXT
    );