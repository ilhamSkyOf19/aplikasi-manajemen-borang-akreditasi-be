/*
  Warnings:

  - You are about to drop the `kebutuhan_dokumen` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[namaDokumen]` on the table `pic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kriteriaId` to the `pic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaDokumen` to the `pic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendekatanId` to the `pic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `kebutuhan_dokumen` DROP FOREIGN KEY `kebutuhan_dokumen_kriteriaId_fkey`;

-- DropForeignKey
ALTER TABLE `kebutuhan_dokumen` DROP FOREIGN KEY `kebutuhan_dokumen_pendekatanId_fkey`;

-- DropForeignKey
ALTER TABLE `pic` DROP FOREIGN KEY `pic_kebutuhanDokumenId_fkey`;

-- DropForeignKey
ALTER TABLE `riwayat` DROP FOREIGN KEY `riwayat_kebutuhan_DokumenId_fkey`;

-- DropIndex
DROP INDEX `riwayat_kebutuhan_DokumenId_fkey` ON `riwayat`;

-- AlterTable
ALTER TABLE `pic` ADD COLUMN `kriteriaId` INTEGER NOT NULL,
    ADD COLUMN `namaDokumen` VARCHAR(191) NOT NULL,
    ADD COLUMN `pendekatanId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `kebutuhan_dokumen`;

-- CreateIndex
CREATE UNIQUE INDEX `pic_namaDokumen_key` ON `pic`(`namaDokumen`);

-- AddForeignKey
ALTER TABLE `pic` ADD CONSTRAINT `pic_kriteriaId_fkey` FOREIGN KEY (`kriteriaId`) REFERENCES `kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pic` ADD CONSTRAINT `pic_pendekatanId_fkey` FOREIGN KEY (`pendekatanId`) REFERENCES `pendekatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
