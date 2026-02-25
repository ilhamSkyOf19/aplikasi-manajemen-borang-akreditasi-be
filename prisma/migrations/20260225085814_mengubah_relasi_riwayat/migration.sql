/*
  Warnings:

  - You are about to drop the column `kebutuhanDokumenPicId` on the `riwayat` table. All the data in the column will be lost.
  - You are about to drop the column `timAkreditasiId` on the `riwayat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `riwayat` DROP FOREIGN KEY `Riwayat_timAkreditasiId_kebutuhanDokumenPicId_fkey`;

-- DropIndex
DROP INDEX `Riwayat_timAkreditasiId_kebutuhanDokumenPicId_fkey` ON `riwayat`;

-- AlterTable
ALTER TABLE `riwayat` DROP COLUMN `kebutuhanDokumenPicId`,
    DROP COLUMN `timAkreditasiId`,
    ADD COLUMN `picId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Riwayat` ADD CONSTRAINT `Riwayat_picId_fkey` FOREIGN KEY (`picId`) REFERENCES `Pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
