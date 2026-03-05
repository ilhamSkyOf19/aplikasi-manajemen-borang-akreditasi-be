-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('wakil_dekan_1', 'kaprodi', 'tim_akreditasi') NOT NULL DEFAULT 'tim_akreditasi',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kriteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kriteria` INTEGER NOT NULL,
    `namaKriteria` VARCHAR(191) NOT NULL,
    `revisi` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kriteria_kriteria_key`(`kriteria`),
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
CREATE TABLE `kebutuhan_dokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaDokumen` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(1000) NOT NULL,
    `kriteriaId` INTEGER NOT NULL,
    `pendekatanId` INTEGER NOT NULL,
    `status` ENUM('menunggu', 'revisi', 'disetujui') NOT NULL DEFAULT 'menunggu',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kebutuhan_dokumen_namaDokumen_key`(`namaDokumen`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tim_akreditasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaTimAkreditasi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timAkreditasiId` INTEGER NOT NULL,
    `kebutuhanDokumenId` INTEGER NOT NULL,
    `status` ENUM('menunggu', 'revisi', 'disetujui') NOT NULL DEFAULT 'menunggu',
    `keterangan` VARCHAR(1000) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pic_timAkreditasiId_kebutuhanDokumenId_key`(`timAkreditasiId`, `kebutuhanDokumenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pic_pj` (
    `picId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`picId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis` ENUM('dokumen_borang', 'pic') NOT NULL,
    `keterangan` VARCHAR(1000) NOT NULL,
    `status` ENUM('menunggu', 'revisi', 'disetujui') NOT NULL DEFAULT 'menunggu',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `picId` INTEGER NULL,
    `kebutuhan_DokumenId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayat_flag_revisi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `riwayatId` INTEGER NOT NULL,
    `flagRevisi` ENUM('dokumen_borang', 'kebutuhan_dokumen', 'pic') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_tim_akreditasi` (
    `userId` INTEGER NOT NULL,
    `timAkreditasiId` INTEGER NOT NULL,

    PRIMARY KEY (`timAkreditasiId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipientId` INTEGER NOT NULL,
    `type` ENUM('KRITERIA_DITAMBAH', 'KRITERIA_DIEDIT', 'KRITERIA_DIHAPUS', 'PIC_BARU_PERLU_VERIFIKASI', 'PIC_DIREVISI_KAPRODI', 'PIC_DISETUJUI_WD1', 'PIC_DIREVISI_WD1') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` VARCHAR(1000) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `picId` INTEGER NULL,
    `kebutuhanDokumen` VARCHAR(191) NULL,
    `kriteria` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `notification_recipientId_isRead_idx`(`recipientId`, `isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumen` ADD CONSTRAINT `kebutuhan_dokumen_kriteriaId_fkey` FOREIGN KEY (`kriteriaId`) REFERENCES `kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumen` ADD CONSTRAINT `kebutuhan_dokumen_pendekatanId_fkey` FOREIGN KEY (`pendekatanId`) REFERENCES `pendekatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pic` ADD CONSTRAINT `pic_timAkreditasiId_fkey` FOREIGN KEY (`timAkreditasiId`) REFERENCES `tim_akreditasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pic` ADD CONSTRAINT `pic_kebutuhanDokumenId_fkey` FOREIGN KEY (`kebutuhanDokumenId`) REFERENCES `kebutuhan_dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pic_pj` ADD CONSTRAINT `pic_pj_picId_fkey` FOREIGN KEY (`picId`) REFERENCES `pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pic_pj` ADD CONSTRAINT `pic_pj_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat` ADD CONSTRAINT `riwayat_picId_fkey` FOREIGN KEY (`picId`) REFERENCES `pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat` ADD CONSTRAINT `riwayat_kebutuhan_DokumenId_fkey` FOREIGN KEY (`kebutuhan_DokumenId`) REFERENCES `kebutuhan_dokumen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_flag_revisi` ADD CONSTRAINT `riwayat_flag_revisi_riwayatId_fkey` FOREIGN KEY (`riwayatId`) REFERENCES `riwayat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_tim_akreditasi` ADD CONSTRAINT `user_tim_akreditasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_tim_akreditasi` ADD CONSTRAINT `user_tim_akreditasi_timAkreditasiId_fkey` FOREIGN KEY (`timAkreditasiId`) REFERENCES `tim_akreditasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
