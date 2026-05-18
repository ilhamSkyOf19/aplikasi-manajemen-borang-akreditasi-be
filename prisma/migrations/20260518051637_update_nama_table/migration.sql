/*
  Warnings:

  - You are about to drop the `priode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kriteria` DROP FOREIGN KEY `kriteria_periode_id_fkey`;

-- DropForeignKey
ALTER TABLE `timeline` DROP FOREIGN KEY `timeline_periode_id_fkey`;

-- DropTable
DROP TABLE `priode`;

-- CreateTable
CREATE TABLE `periode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `timeline` ADD CONSTRAINT `timeline_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kriteria` ADD CONSTRAINT `kriteria_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
