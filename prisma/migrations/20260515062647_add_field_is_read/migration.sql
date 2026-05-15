/*
  Warnings:

  - Added the required column `isRead` to the `riwayat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `riwayat` ADD COLUMN `isRead` BOOLEAN NOT NULL;
