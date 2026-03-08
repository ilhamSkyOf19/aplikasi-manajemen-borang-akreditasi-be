/*
  Warnings:

  - You are about to drop the column `timAkreditasiId` on the `pic` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kebutuhanDokumenId]` on the table `pic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[namaTimAkreditasi]` on the table `tim_akreditasi` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `pic` DROP FOREIGN KEY `pic_timAkreditasiId_fkey`;

-- DropIndex
DROP INDEX `pic_timAkreditasiId_kebutuhanDokumenId_key` ON `pic`;

-- AlterTable
ALTER TABLE `pic` DROP COLUMN `timAkreditasiId`;

-- CreateTable
CREATE TABLE `pic_tim_akreditasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `picId` INTEGER NOT NULL,
    `timAkreditasiId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `pic_tim_akreditasi_picId_timAkreditasiId_key`(`picId`, `timAkreditasiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `pic_kebutuhanDokumenId_key` ON `pic`(`kebutuhanDokumenId`);

-- CreateIndex
CREATE UNIQUE INDEX `tim_akreditasi_namaTimAkreditasi_key` ON `tim_akreditasi`(`namaTimAkreditasi`);

-- AddForeignKey
ALTER TABLE `pic_tim_akreditasi` ADD CONSTRAINT `pic_tim_akreditasi_picId_fkey` FOREIGN KEY (`picId`) REFERENCES `pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pic_tim_akreditasi` ADD CONSTRAINT `pic_tim_akreditasi_timAkreditasiId_fkey` FOREIGN KEY (`timAkreditasiId`) REFERENCES `tim_akreditasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
