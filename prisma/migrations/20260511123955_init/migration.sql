/*
  Warnings:

  - You are about to drop the `distribusikebutuhandokumentasi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `distribusikebutuhandokumentasi`;

-- CreateTable
CREATE TABLE `distribusi_kebutuhan_dokumentasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
