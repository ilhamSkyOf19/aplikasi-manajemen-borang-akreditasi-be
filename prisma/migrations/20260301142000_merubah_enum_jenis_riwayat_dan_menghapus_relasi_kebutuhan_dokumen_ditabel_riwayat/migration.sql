/*
  Warnings:

  - You are about to drop the column `kebutuhanDokumenId` on the `riwayat` table. All the data in the column will be lost.
  - The values [kebutuhan_dokumen] on the enum `Riwayat_jenis` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `riwayat` DROP FOREIGN KEY `Riwayat_kebutuhanDokumenId_fkey`;

-- DropIndex
DROP INDEX `Riwayat_kebutuhanDokumenId_fkey` ON `riwayat`;

-- AlterTable
ALTER TABLE `riwayat` DROP COLUMN `kebutuhanDokumenId`,
    ADD COLUMN `kebutuhan_DokumenId` INTEGER NULL,
    MODIFY `jenis` ENUM('dokumen_borang', 'pic') NOT NULL;

-- AddForeignKey
ALTER TABLE `Riwayat` ADD CONSTRAINT `Riwayat_kebutuhan_DokumenId_fkey` FOREIGN KEY (`kebutuhan_DokumenId`) REFERENCES `Kebutuhan_Dokumen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
