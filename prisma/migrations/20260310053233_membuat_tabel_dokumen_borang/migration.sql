-- CreateTable
CREATE TABLE `dokumen_borang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(1000) NOT NULL,
    `lokasi_file` ENUM('GDRIVE', 'SISTEM') NOT NULL,
    `status` ENUM('menunggu', 'revisi', 'disetujui') NOT NULL,
    `uploadedById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pic_dokumen_borang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `picId` INTEGER NOT NULL,
    `dokumenBorangId` INTEGER NOT NULL,
    `assignedById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `pic_dokumen_borang_picId_dokumenBorangId_key`(`picId`, `dokumenBorangId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dokumen_borang` ADD CONSTRAINT `dokumen_borang_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pic_dokumen_borang` ADD CONSTRAINT `pic_dokumen_borang_picId_fkey` FOREIGN KEY (`picId`) REFERENCES `pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pic_dokumen_borang` ADD CONSTRAINT `pic_dokumen_borang_dokumenBorangId_fkey` FOREIGN KEY (`dokumenBorangId`) REFERENCES `dokumen_borang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pic_dokumen_borang` ADD CONSTRAINT `pic_dokumen_borang_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
