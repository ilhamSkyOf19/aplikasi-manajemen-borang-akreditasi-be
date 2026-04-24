/*
  Warnings:

  - You are about to drop the column `kriteria_id` on the `kriteria_pic` table. All the data in the column will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kriteri_id,dosen_id]` on the table `kriteria_pic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kriteri_id` to the `kriteria_pic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `account_dosen_id_fkey`;

-- DropForeignKey
ALTER TABLE `kriteria_pic` DROP FOREIGN KEY `kriteria_pic_kriteria_id_fkey`;

-- DropIndex
DROP INDEX `kriteria_pic_kriteria_id_dosen_id_key` ON `kriteria_pic`;

-- AlterTable
ALTER TABLE `kriteria_pic` DROP COLUMN `kriteria_id`,
    ADD COLUMN `kriteri_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `account`;

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

-- CreateIndex
CREATE UNIQUE INDEX `kriteria_pic_kriteri_id_dosen_id_key` ON `kriteria_pic`(`kriteri_id`, `dosen_id`);

-- AddForeignKey
ALTER TABLE `dosen_role` ADD CONSTRAINT `dosen_role_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kriteria_pic` ADD CONSTRAINT `kriteria_pic_kriteri_id_fkey` FOREIGN KEY (`kriteri_id`) REFERENCES `kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
