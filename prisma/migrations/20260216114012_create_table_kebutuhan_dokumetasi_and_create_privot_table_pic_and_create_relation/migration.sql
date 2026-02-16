-- CreateTable
CREATE TABLE `pendekatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahap` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pendekatan_tahap_key`(`tahap`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kebutuhan_Dokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaDokumen` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NOT NULL,
    `kriteriaId` INTEGER NOT NULL,
    `pendekatanId` INTEGER NOT NULL,

    UNIQUE INDEX `Kebutuhan_Dokumen_namaDokumen_key`(`namaDokumen`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pic` (
    `timAkreditasiId` INTEGER NOT NULL,
    `kebutuhanDokumenId` INTEGER NOT NULL,
    `pjId` INTEGER NOT NULL,
    `status` ENUM('menunggu', 'revisi', 'disetujui') NOT NULL,

    PRIMARY KEY (`timAkreditasiId`, `kebutuhanDokumenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kebutuhan_Dokumen` ADD CONSTRAINT `Kebutuhan_Dokumen_kriteriaId_fkey` FOREIGN KEY (`kriteriaId`) REFERENCES `Kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kebutuhan_Dokumen` ADD CONSTRAINT `Kebutuhan_Dokumen_pendekatanId_fkey` FOREIGN KEY (`pendekatanId`) REFERENCES `pendekatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pic` ADD CONSTRAINT `Pic_timAkreditasiId_fkey` FOREIGN KEY (`timAkreditasiId`) REFERENCES `Tim_Akreditasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pic` ADD CONSTRAINT `Pic_kebutuhanDokumenId_fkey` FOREIGN KEY (`kebutuhanDokumenId`) REFERENCES `Kebutuhan_Dokumen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pic` ADD CONSTRAINT `Pic_pjId_fkey` FOREIGN KEY (`pjId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
