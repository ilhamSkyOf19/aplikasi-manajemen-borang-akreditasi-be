-- CreateTable
CREATE TABLE `dokumentasi_borang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kebutuhan_dokumentasi_id` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'REVISION', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    `keterangan` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `dokumentasi_borang_kebutuhan_dokumentasi_id_idx`(`kebutuhan_dokumentasi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumentasi_borang_default` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dokumentasi_borang_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dokumentasi_borang_default_dokumentasi_borang_id_key`(`dokumentasi_borang_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `folder_dokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dokumentasi_borang_id` INTEGER NOT NULL,
    `nama_folder` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `folder_dokumen_dokumentasi_borang_id_idx`(`dokumentasi_borang_id`),
    UNIQUE INDEX `folder_dokumen_dokumentasi_borang_id_nama_folder_key`(`dokumentasi_borang_id`, `nama_folder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file_dokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_file` VARCHAR(191) NOT NULL,
    `storage_provider` ENUM('GDRIVE', 'SISTEM') NOT NULL DEFAULT 'SISTEM',
    `provider_file_id` VARCHAR(191) NULL,
    `uploaded_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `file_dokumen_uploaded_by_id_idx`(`uploaded_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumentasi_borang_file` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dokumentasi_borang_id` INTEGER NOT NULL,
    `file_dokumen_id` INTEGER NOT NULL,
    `folder_dokumen_id` INTEGER NULL,
    `keterangan` VARCHAR(1000) NOT NULL,
    `status` ENUM('PENDING', 'REVISION', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `dokumentasi_borang_file_dokumentasi_borang_id_idx`(`dokumentasi_borang_id`),
    INDEX `dokumentasi_borang_file_file_dokumen_id_idx`(`file_dokumen_id`),
    INDEX `dokumentasi_borang_file_folder_dokumen_id_idx`(`folder_dokumen_id`),
    UNIQUE INDEX `dokumentasi_borang_file_dokumentasi_borang_id_file_dokumen_i_key`(`dokumentasi_borang_id`, `file_dokumen_id`, `folder_dokumen_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dokumentasi_borang` ADD CONSTRAINT `dokumentasi_borang_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`kebutuhan_dokumentasi_id`) REFERENCES `kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumentasi_borang_default` ADD CONSTRAINT `dokumentasi_borang_default_dokumentasi_borang_id_fkey` FOREIGN KEY (`dokumentasi_borang_id`) REFERENCES `dokumentasi_borang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `folder_dokumen` ADD CONSTRAINT `folder_dokumen_dokumentasi_borang_id_fkey` FOREIGN KEY (`dokumentasi_borang_id`) REFERENCES `dokumentasi_borang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file_dokumen` ADD CONSTRAINT `file_dokumen_uploaded_by_id_fkey` FOREIGN KEY (`uploaded_by_id`) REFERENCES `dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumentasi_borang_file` ADD CONSTRAINT `dokumentasi_borang_file_dokumentasi_borang_id_fkey` FOREIGN KEY (`dokumentasi_borang_id`) REFERENCES `dokumentasi_borang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumentasi_borang_file` ADD CONSTRAINT `dokumentasi_borang_file_file_dokumen_id_fkey` FOREIGN KEY (`file_dokumen_id`) REFERENCES `file_dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumentasi_borang_file` ADD CONSTRAINT `dokumentasi_borang_file_folder_dokumen_id_fkey` FOREIGN KEY (`folder_dokumen_id`) REFERENCES `folder_dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
