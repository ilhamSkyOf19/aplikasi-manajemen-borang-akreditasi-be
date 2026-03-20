/*
  Warnings:

  - You are about to drop the column `kebutuhanDokumenId` on the `pic` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `pic_kebutuhanDokumenId_key` ON `pic`;

-- AlterTable
ALTER TABLE `pic` DROP COLUMN `kebutuhanDokumenId`;
