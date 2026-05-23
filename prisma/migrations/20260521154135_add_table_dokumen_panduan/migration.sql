-- CreateTable
CREATE TABLE `dokumen_panduan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `periode_id` INTEGER NOT NULL,
    `nama_file` VARCHAR(191) NOT NULL,
    `id_file` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dokumen_panduan_periode_id_key`(`periode_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dokumen_panduan` ADD CONSTRAINT `dokumen_panduan_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
