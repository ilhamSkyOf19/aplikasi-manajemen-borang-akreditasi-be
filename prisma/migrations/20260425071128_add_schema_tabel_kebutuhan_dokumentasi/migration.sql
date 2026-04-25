-- CreateTable
CREATE TABLE `kebutuhan_dokumentasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kriteria_id` INTEGER NOT NULL,
    `pendekatan_id` INTEGER NOT NULL,
    `pic_id` INTEGER NOT NULL,
    `nama_kebutuhan_dokumentasi_id` INTEGER NOT NULL,
    `tipe_dokumentasi` ENUM('DEFAULT', 'PENELITIAN') NOT NULL DEFAULT 'DEFAULT',
    `status` ENUM('PENDING', 'REVISION', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    `keterangan` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nama_kebutuhan_dokumentasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kebutuhan_dokumentasi` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `nama_kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi_key`(`nama_kebutuhan_dokumentasi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pic_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kebutuhan_dokumentasi_id` INTEGER NOT NULL,
    `nama_kebutuhan_dokumentasi_id` INTEGER NOT NULL,

    UNIQUE INDEX `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi_kebutuhan_d_key`(`kebutuhan_dokumentasi_id`, `nama_kebutuhan_dokumentasi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kebutuhan_dokumentasi_pic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kebutuhan_dokumentasi_id` INTEGER NOT NULL,
    `pic_id` INTEGER NOT NULL,

    UNIQUE INDEX `kebutuhan_dokumentasi_pic_kebutuhan_dokumentasi_id_pic_id_key`(`kebutuhan_dokumentasi_id`, `pic_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipe_riwayat` ENUM('DOKUMENTASI_BORANG', 'KEBUTUHAN_DOKUMENTASI') NOT NULL,
    `keterangan` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `kebutuhan_dokumentasi_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi` ADD CONSTRAINT `kebutuhan_dokumentasi_kriteria_id_fkey` FOREIGN KEY (`kriteria_id`) REFERENCES `kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi` ADD CONSTRAINT `kebutuhan_dokumentasi_pendekatan_id_fkey` FOREIGN KEY (`pendekatan_id`) REFERENCES `pendekatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi` ADD CONSTRAINT `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi_kebutuhan__fkey` FOREIGN KEY (`kebutuhan_dokumentasi_id`) REFERENCES `kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi` ADD CONSTRAINT `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi_nama_kebut_fkey` FOREIGN KEY (`nama_kebutuhan_dokumentasi_id`) REFERENCES `nama_kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` ADD CONSTRAINT `kebutuhan_dokumentasi_pic_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`kebutuhan_dokumentasi_id`) REFERENCES `kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` ADD CONSTRAINT `kebutuhan_dokumentasi_pic_pic_id_fkey` FOREIGN KEY (`pic_id`) REFERENCES `pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat` ADD CONSTRAINT `riwayat_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`kebutuhan_dokumentasi_id`) REFERENCES `kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
