/*
  Warnings:

  - A unique constraint covering the columns `[periode_id,kode_kriteria,nama_kriteria]` on the table `kriteria` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `periode_id` to the `kriteria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kriteria` ADD COLUMN `periode_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `priode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timeline` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `periode_id` INTEGER NOT NULL,
    `deadline_kebutuhan_dokumentasi` DATETIME(3) NOT NULL,
    `deadline_dokumentasi_borang` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `timeline_periode_id_deadline_kebutuhan_dokumentasi_deadline__key`(`periode_id`, `deadline_kebutuhan_dokumentasi`, `deadline_dokumentasi_borang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `kriteria_periode_id_kode_kriteria_nama_kriteria_key` ON `kriteria`(`periode_id`, `kode_kriteria`, `nama_kriteria`);

-- AddForeignKey
ALTER TABLE `timeline` ADD CONSTRAINT `timeline_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `priode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kriteria` ADD CONSTRAINT `kriteria_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `priode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
