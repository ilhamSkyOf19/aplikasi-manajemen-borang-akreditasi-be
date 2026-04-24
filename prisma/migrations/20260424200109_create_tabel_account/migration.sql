/*
  Warnings:

  - You are about to drop the column `role` on the `dosen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dosen` DROP COLUMN `role`;

-- CreateTable
CREATE TABLE `account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosen_id` INTEGER NOT NULL,
    `role` ENUM('wakil_dekan_1', 'kaprodi', 'tim_akreditasi') NOT NULL DEFAULT 'tim_akreditasi',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `account_dosen_id_role_key`(`dosen_id`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
