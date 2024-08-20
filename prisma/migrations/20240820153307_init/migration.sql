/*
  Warnings:

  - Added the required column `username` to the `Pass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pass" ADD COLUMN     "username" TEXT NOT NULL;
