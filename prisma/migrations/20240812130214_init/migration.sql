-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nexusmods" SET DEFAULT '',
ALTER COLUMN "github" SET DEFAULT '',
ALTER COLUMN "theme" SET DEFAULT 'default',
ALTER COLUMN "description" SET DEFAULT '';

-- CreateTable
CREATE TABLE "Suggestions" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trivia" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trivia_pkey" PRIMARY KEY ("id")
);
