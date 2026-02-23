-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('wakil_dekan_1', 'kaprodi', 'tim_akreditasi') NOT NULL DEFAULT 'tim_akreditasi',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kriteria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kriteria` INTEGER NOT NULL,
    `namaKriteria` VARCHAR(191) NOT NULL,
    `revisi` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Kriteria_kriteria_key`(`kriteria`),
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
CREATE TABLE `Tim_Akreditasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaTimAkreditasi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kebutuhan_Dokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaDokumen` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(1000) NOT NULL,
    `kriteriaId` INTEGER NOT NULL,
    `pendekatanId` INTEGER NOT NULL,
    `status` ENUM('menunggu', 'revisi', 'disetujui') NOT NULL DEFAULT 'menunggu',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Kebutuhan_Dokumen_namaDokumen_key`(`namaDokumen`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Riwayat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis` ENUM('kebutuhan_dokumen', 'dokumen_borang', 'pic') NOT NULL,
    `keterangan` VARCHAR(1000) NOT NULL,
    `status` ENUM('menunggu', 'revisi', 'disetujui') NOT NULL DEFAULT 'menunggu',
    `kebutuhanDokumenId` INTEGER NULL,
    `timAkreditasiId` INTEGER NULL,
    `kebutuhanDokumenPicId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timAkreditasiId` INTEGER NOT NULL,
    `kebutuhanDokumenId` INTEGER NOT NULL,
    `status` ENUM('menunggu', 'revisi', 'disetujui') NOT NULL DEFAULT 'menunggu',
    `keterangan` VARCHAR(1000) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pic_timAkreditasiId_kebutuhanDokumenId_key`(`timAkreditasiId`, `kebutuhanDokumenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pic_pj` (
    `picId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`picId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Tim_Akreditasi` (
    `userId` INTEGER NOT NULL,
    `timAkreditasiId` INTEGER NOT NULL,

    PRIMARY KEY (`timAkreditasiId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kebutuhan_Dokumen` ADD CONSTRAINT `Kebutuhan_Dokumen_kriteriaId_fkey` FOREIGN KEY (`kriteriaId`) REFERENCES `Kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kebutuhan_Dokumen` ADD CONSTRAINT `Kebutuhan_Dokumen_pendekatanId_fkey` FOREIGN KEY (`pendekatanId`) REFERENCES `pendekatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Riwayat` ADD CONSTRAINT `Riwayat_kebutuhanDokumenId_fkey` FOREIGN KEY (`kebutuhanDokumenId`) REFERENCES `Kebutuhan_Dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Riwayat` ADD CONSTRAINT `Riwayat_timAkreditasiId_kebutuhanDokumenPicId_fkey` FOREIGN KEY (`timAkreditasiId`, `kebutuhanDokumenPicId`) REFERENCES `Pic`(`timAkreditasiId`, `kebutuhanDokumenId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pic` ADD CONSTRAINT `Pic_timAkreditasiId_fkey` FOREIGN KEY (`timAkreditasiId`) REFERENCES `Tim_Akreditasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pic` ADD CONSTRAINT `Pic_kebutuhanDokumenId_fkey` FOREIGN KEY (`kebutuhanDokumenId`) REFERENCES `Kebutuhan_Dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pic_pj` ADD CONSTRAINT `Pic_pj_picId_fkey` FOREIGN KEY (`picId`) REFERENCES `Pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pic_pj` ADD CONSTRAINT `Pic_pj_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Tim_Akreditasi` ADD CONSTRAINT `User_Tim_Akreditasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Tim_Akreditasi` ADD CONSTRAINT `User_Tim_Akreditasi_timAkreditasiId_fkey` FOREIGN KEY (`timAkreditasiId`) REFERENCES `Tim_Akreditasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
