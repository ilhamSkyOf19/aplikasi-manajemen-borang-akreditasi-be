/*
  Warnings:

  - You are about to drop the column `createdAt` on the `kriteria` table. All the data in the column will be lost.
  - You are about to drop the column `kriteria` on the `kriteria` table. All the data in the column will be lost.
  - You are about to drop the column `namaKriteria` on the `kriteria` table. All the data in the column will be lost.
  - You are about to drop the column `revisi` on the `kriteria` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `kriteria` table. All the data in the column will be lost.
  - You are about to drop the `dokumen_borang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pic_dokumen_borang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pic_tim_akreditasi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `riwayat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tim_akreditasi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_tim_akreditasi` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kode_kriteria]` on the table `kriteria` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kode_kriteria` to the `kriteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_kriteria` to the `kriteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `kriteria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `dokumen_borang` DROP FOREIGN KEY `dokumen_borang_uploadedById_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_recipientId_fkey`;

-- DropForeignKey
ALTER TABLE `pic` DROP FOREIGN KEY `pic_kriteriaId_fkey`;

-- DropForeignKey
ALTER TABLE `pic` DROP FOREIGN KEY `pic_pendekatanId_fkey`;

-- DropForeignKey
ALTER TABLE `pic_dokumen_borang` DROP FOREIGN KEY `pic_dokumen_borang_assignedById_fkey`;

-- DropForeignKey
ALTER TABLE `pic_dokumen_borang` DROP FOREIGN KEY `pic_dokumen_borang_dokumenBorangId_fkey`;

-- DropForeignKey
ALTER TABLE `pic_dokumen_borang` DROP FOREIGN KEY `pic_dokumen_borang_picId_fkey`;

-- DropForeignKey
ALTER TABLE `pic_tim_akreditasi` DROP FOREIGN KEY `pic_tim_akreditasi_picId_fkey`;

-- DropForeignKey
ALTER TABLE `pic_tim_akreditasi` DROP FOREIGN KEY `pic_tim_akreditasi_timAkreditasiId_fkey`;

-- DropForeignKey
ALTER TABLE `riwayat` DROP FOREIGN KEY `riwayat_picId_fkey`;

-- DropForeignKey
ALTER TABLE `user_tim_akreditasi` DROP FOREIGN KEY `user_tim_akreditasi_timAkreditasiId_fkey`;

-- DropForeignKey
ALTER TABLE `user_tim_akreditasi` DROP FOREIGN KEY `user_tim_akreditasi_userId_fkey`;

-- DropIndex
DROP INDEX `kriteria_kriteria_key` ON `kriteria`;

-- AlterTable
ALTER TABLE `kriteria` DROP COLUMN `createdAt`,
    DROP COLUMN `kriteria`,
    DROP COLUMN `namaKriteria`,
    DROP COLUMN `revisi`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `kode_kriteria` INTEGER NOT NULL,
    ADD COLUMN `nama_kriteria` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `dokumen_borang`;

-- DropTable
DROP TABLE `notification`;

-- DropTable
DROP TABLE `pic`;

-- DropTable
DROP TABLE `pic_dokumen_borang`;

-- DropTable
DROP TABLE `pic_tim_akreditasi`;

-- DropTable
DROP TABLE `riwayat`;

-- DropTable
DROP TABLE `tim_akreditasi`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `user_tim_akreditasi`;

-- CreateTable
CREATE TABLE `dosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('wakil_dekan_1', 'kaprodi', 'tim_akreditasi') NOT NULL DEFAULT 'tim_akreditasi',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dosen_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kriteria_pic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kriteri_id` INTEGER NOT NULL,
    `dosen_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kriteria_pic_kriteri_id_dosen_id_key`(`kriteri_id`, `dosen_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `kriteria_kode_kriteria_key` ON `kriteria`(`kode_kriteria`);

-- AddForeignKey
ALTER TABLE `kriteria_pic` ADD CONSTRAINT `kriteria_pic_kriteri_id_fkey` FOREIGN KEY (`kriteri_id`) REFERENCES `kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kriteria_pic` ADD CONSTRAINT `kriteria_pic_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
