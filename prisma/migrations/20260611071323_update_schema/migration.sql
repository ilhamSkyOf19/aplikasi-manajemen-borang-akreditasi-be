/*
  Warnings:

  - You are about to drop the `kebutuhan_dokumentasi_pic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` DROP FOREIGN KEY `kebutuhan_dokumentasi_pic_kebutuhan_dokumentasi_id_fkey`;

-- DropForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` DROP FOREIGN KEY `kebutuhan_dokumentasi_pic_pic_id_fkey`;

-- DropTable
DROP TABLE `kebutuhan_dokumentasi_pic`;

-- DropTable
DROP TABLE `pic`;

-- CreateTable
CREATE TABLE `lokasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `lokasi_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kebutuhan_dokumentasi_lokasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kebutuhan_dokumentasi_id` INTEGER NOT NULL,
    `lokasi_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `kebutuhan_dokumentasi_lokasi_kebutuhan_dokumentasi_id_idx`(`kebutuhan_dokumentasi_id`),
    INDEX `kebutuhan_dokumentasi_lokasi_lokasi_id_idx`(`lokasi_id`),
    UNIQUE INDEX `kebutuhan_dokumentasi_lokasi_kebutuhan_dokumentasi_id_lokasi_key`(`kebutuhan_dokumentasi_id`, `lokasi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_lokasi` ADD CONSTRAINT `kebutuhan_dokumentasi_lokasi_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`kebutuhan_dokumentasi_id`) REFERENCES `kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_lokasi` ADD CONSTRAINT `kebutuhan_dokumentasi_lokasi_lokasi_id_fkey` FOREIGN KEY (`lokasi_id`) REFERENCES `lokasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
