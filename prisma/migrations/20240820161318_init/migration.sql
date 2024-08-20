/*
  Warnings:

  - Added the required column `salt` to the `Pass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pass" ADD COLUMN     "salt" TEXT NOT NULL;
