/*
  Warnings:

  - Added the required column `status` to the `riwayat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `riwayat` ADD COLUMN `status` ENUM('PENDING', 'REVISION', 'APPROVED') NOT NULL;
