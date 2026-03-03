/*
  Warnings:

  - You are about to drop the column `flagRevisi` on the `riwayat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `riwayat` DROP COLUMN `flagRevisi`;

-- CreateTable
CREATE TABLE `Riwayat_flag_revisi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `riwayatId` INTEGER NULL,
    `flagRevisi` ENUM('dokumen_borang', 'kebutuhan_dokumen', 'pic') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Riwayat_flag_revisi` ADD CONSTRAINT `Riwayat_flag_revisi_riwayatId_fkey` FOREIGN KEY (`riwayatId`) REFERENCES `Riwayat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
