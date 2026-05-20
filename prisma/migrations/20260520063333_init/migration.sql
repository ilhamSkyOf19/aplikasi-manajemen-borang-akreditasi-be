-- CreateTable
CREATE TABLE `dosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nidn` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dosen_email_key`(`email`),
    UNIQUE INDEX `dosen_nidn_key`(`nidn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NOT NULL,
    `role` ENUM('wakil_dekan_1', 'kaprodi', 'tim_akreditasi') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dosen_role_dosen_id_role_key`(`dosen_id`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `periode_start_date_end_date_key`(`start_date`, `end_date`),
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

-- CreateTable
CREATE TABLE `kriteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `periode_id` INTEGER NOT NULL,
    `kode_kriteria` INTEGER NOT NULL,
    `nama_kriteria` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kriteria_periode_id_kode_kriteria_key`(`periode_id`, `kode_kriteria`),
    UNIQUE INDEX `kriteria_periode_id_nama_kriteria_key`(`periode_id`, `nama_kriteria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kriteria_pic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kriteria_id` INTEGER NOT NULL,
    `dosen_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kriteria_pic_kriteria_id_dosen_id_key`(`kriteria_id`, `dosen_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendekatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahap` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pendekatan_keterangan_key`(`keterangan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kebutuhan_dokumentasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kriteria_id` INTEGER NOT NULL,
    `pendekatan_id` INTEGER NOT NULL,
    `nama_kebutuhan_dokumentasi_id` INTEGER NOT NULL,
    `tipe_dokumentasi` ENUM('DEFAULT', 'PENELITIAN') NOT NULL DEFAULT 'DEFAULT',
    `status` ENUM('PENDING', 'REVISION', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    `keterangan` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kebutuhan_dokumentasi_kriteria_id_pendekatan_id_nama_kebutuh_key`(`kriteria_id`, `pendekatan_id`, `nama_kebutuhan_dokumentasi_id`),
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

-- CreateTable
CREATE TABLE `nama_kebutuhan_dokumentasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kebutuhan_dokumentasi` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `nama_kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi_key`(`nama_kebutuhan_dokumentasi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumentasi_borang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kebutuhan_dokumentasi_id` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'REVISION', 'APPROVED') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `dokumentasi_borang_kebutuhan_dokumentasi_id_idx`(`kebutuhan_dokumentasi_id`),
    UNIQUE INDEX `dokumentasi_borang_kebutuhan_dokumentasi_id_key`(`kebutuhan_dokumentasi_id`),
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
    `file_id` VARCHAR(191) NOT NULL,
    `nama_file` VARCHAR(191) NOT NULL,
    `storage_provider` ENUM('GDRIVE', 'SISTEM') NOT NULL DEFAULT 'SISTEM',
    `uploaded_by_id` INTEGER NOT NULL,
    `keterangan` VARCHAR(1000) NOT NULL,
    `tipe_file` ENUM('DEFAULT', 'PENELITIAN') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `file_dokumen_file_id_key`(`file_id`),
    UNIQUE INDEX `file_dokumen_nama_file_key`(`nama_file`),
    INDEX `file_dokumen_uploaded_by_id_idx`(`uploaded_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumentasi_borang_file` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dokumentasi_borang_id` INTEGER NOT NULL,
    `file_dokumen_id` INTEGER NOT NULL,
    `folder_dokumen_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `dokumentasi_borang_file_dokumentasi_borang_id_folder_dokumen_idx`(`dokumentasi_borang_id`, `folder_dokumen_id`),
    UNIQUE INDEX `dokumentasi_borang_file_dokumentasi_borang_id_file_dokumen_i_key`(`dokumentasi_borang_id`, `file_dokumen_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `distribusi_kebutuhan_dokumentasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `periode_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `distribusi_kebutuhan_dokumentasi_id_periode_id_key`(`id`, `periode_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipe_riwayat` ENUM('DOKUMENTASI_BORANG', 'KEBUTUHAN_DOKUMENTASI') NOT NULL,
    `dosen_id` INTEGER NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `keterangan` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `kebutuhan_dokumentasi_id` INTEGER NULL,
    `dokumentasi_borang_id` INTEGER NULL,
    `status` ENUM('PENDING', 'REVISION', 'APPROVED') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dosen_role` ADD CONSTRAINT `dosen_role_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timeline` ADD CONSTRAINT `timeline_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kriteria` ADD CONSTRAINT `kriteria_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kriteria_pic` ADD CONSTRAINT `kriteria_pic_kriteria_id_fkey` FOREIGN KEY (`kriteria_id`) REFERENCES `kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kriteria_pic` ADD CONSTRAINT `kriteria_pic_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi` ADD CONSTRAINT `kebutuhan_dokumentasi_kriteria_id_fkey` FOREIGN KEY (`kriteria_id`) REFERENCES `kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi` ADD CONSTRAINT `kebutuhan_dokumentasi_pendekatan_id_fkey` FOREIGN KEY (`pendekatan_id`) REFERENCES `pendekatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi` ADD CONSTRAINT `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`nama_kebutuhan_dokumentasi_id`) REFERENCES `nama_kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` ADD CONSTRAINT `kebutuhan_dokumentasi_pic_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`kebutuhan_dokumentasi_id`) REFERENCES `kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` ADD CONSTRAINT `kebutuhan_dokumentasi_pic_pic_id_fkey` FOREIGN KEY (`pic_id`) REFERENCES `pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumentasi_borang` ADD CONSTRAINT `dokumentasi_borang_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`kebutuhan_dokumentasi_id`) REFERENCES `kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `file_dokumen_default` ADD CONSTRAINT `file_dokumen_default_file_dokumen_id_fkey` FOREIGN KEY (`file_dokumen_id`) REFERENCES `file_dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file_dokumen_penelitian` ADD CONSTRAINT `file_dokumen_penelitian_file_dokumen_id_fkey` FOREIGN KEY (`file_dokumen_id`) REFERENCES `file_dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribusi_kebutuhan_dokumentasi` ADD CONSTRAINT `distribusi_kebutuhan_dokumentasi_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat` ADD CONSTRAINT `riwayat_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat` ADD CONSTRAINT `riwayat_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`kebutuhan_dokumentasi_id`) REFERENCES `kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat` ADD CONSTRAINT `riwayat_dokumentasi_borang_id_fkey` FOREIGN KEY (`dokumentasi_borang_id`) REFERENCES `dokumentasi_borang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
