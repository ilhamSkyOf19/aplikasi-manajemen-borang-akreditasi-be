/*
  Warnings:

  - You are about to drop the `anggota` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `anggota`;

-- CreateTable
CREATE TABLE `Tim_Akreditasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaTimAkreditasi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_Tim_Akreditasi` (
    `userId` INTEGER NOT NULL,
    `timAkreditasiId` INTEGER NOT NULL,

    PRIMARY KEY (`timAkreditasiId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User_Tim_Akreditasi` ADD CONSTRAINT `User_Tim_Akreditasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Tim_Akreditasi` ADD CONSTRAINT `User_Tim_Akreditasi_timAkreditasiId_fkey` FOREIGN KEY (`timAkreditasiId`) REFERENCES `Tim_Akreditasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
