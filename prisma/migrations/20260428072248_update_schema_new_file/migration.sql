/*
  Warnings:

  - You are about to drop the `dokumentasi_borang_default` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `dokumentasi_borang_default` DROP FOREIGN KEY `dokumentasi_borang_default_dokumentasi_borang_id_fkey`;

-- DropTable
DROP TABLE `dokumentasi_borang_default`;

-- CreateTable
CREATE TABLE `file_dokumen_default` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_dokumen_id` INTEGER NOT NULL,
    `nomor_dokumen` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `file_dokumen_default_file_dokumen_id_key`(`file_dokumen_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `file_dokumen_default` ADD CONSTRAINT `file_dokumen_default_file_dokumen_id_fkey` FOREIGN KEY (`file_dokumen_id`) REFERENCES `file_dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
