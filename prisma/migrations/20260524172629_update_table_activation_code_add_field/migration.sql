/*
  Warnings:

  - Added the required column `expired_at` to the `activation_code` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activation_code` ADD COLUMN `expired_at` DATETIME(3) NOT NULL,
    ADD COLUMN `reset_token` VARCHAR(191) NULL;
