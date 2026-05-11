-- CreateTable
CREATE TABLE `file_dokumen_penelitian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_dokumen_id` INTEGER NOT NULL,
    `judul_penelitian` VARCHAR(191) NOT NULL,
    `tahun` YEAR NOT NULL,
    `link_publikasi` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `file_dokumen_penelitian_file_dokumen_id_key`(`file_dokumen_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `file_dokumen_penelitian` ADD CONSTRAINT `file_dokumen_penelitian_file_dokumen_id_fkey` FOREIGN KEY (`file_dokumen_id`) REFERENCES `file_dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
