/*
  Warnings:

  - Added the required column `dosen_id` to the `riwayat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `riwayat` ADD COLUMN `dosen_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `riwayat` ADD CONSTRAINT `riwayat_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
