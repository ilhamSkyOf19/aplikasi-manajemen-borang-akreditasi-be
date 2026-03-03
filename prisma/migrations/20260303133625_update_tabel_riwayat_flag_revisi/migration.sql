/*
  Warnings:

  - Made the column `riwayatId` on table `riwayat_flag_revisi` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `riwayat_flag_revisi` DROP FOREIGN KEY `Riwayat_flag_revisi_riwayatId_fkey`;

-- DropIndex
DROP INDEX `Riwayat_flag_revisi_riwayatId_fkey` ON `riwayat_flag_revisi`;

-- AlterTable
ALTER TABLE `riwayat_flag_revisi` MODIFY `riwayatId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Riwayat_flag_revisi` ADD CONSTRAINT `Riwayat_flag_revisi_riwayatId_fkey` FOREIGN KEY (`riwayatId`) REFERENCES `Riwayat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
