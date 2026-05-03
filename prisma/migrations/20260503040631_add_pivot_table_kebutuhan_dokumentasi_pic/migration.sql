/*
  Warnings:

  - You are about to drop the column `pic_id` on the `kebutuhan_dokumentasi` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `kebutuhan_dokumentasi` DROP FOREIGN KEY `kebutuhan_dokumentasi_pic_id_fkey`;

-- DropIndex
DROP INDEX `kebutuhan_dokumentasi_pic_id_fkey` ON `kebutuhan_dokumentasi`;

-- AlterTable
ALTER TABLE `kebutuhan_dokumentasi` DROP COLUMN `pic_id`;

-- CreateTable
CREATE TABLE `kebutuhan_dokumentasi_pic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kebutuhan_dokumentasi_id` INTEGER NOT NULL,
    `pic_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `kebutuhan_dokumentasi_pic_kebutuhan_dokumentasi_id_idx`(`kebutuhan_dokumentasi_id`),
    INDEX `kebutuhan_dokumentasi_pic_pic_id_idx`(`pic_id`),
    UNIQUE INDEX `kebutuhan_dokumentasi_pic_kebutuhan_dokumentasi_id_pic_id_key`(`kebutuhan_dokumentasi_id`, `pic_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` ADD CONSTRAINT `kebutuhan_dokumentasi_pic_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`kebutuhan_dokumentasi_id`) REFERENCES `kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` ADD CONSTRAINT `kebutuhan_dokumentasi_pic_pic_id_fkey` FOREIGN KEY (`pic_id`) REFERENCES `pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
