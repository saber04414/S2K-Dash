/*
  Warnings:

  - Added the required column `secretPassword` to the `MyEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MyEmail" ADD COLUMN     "secretPassword" TEXT NOT NULL;
