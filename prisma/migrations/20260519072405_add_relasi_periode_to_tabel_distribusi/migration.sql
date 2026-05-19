/*
  Warnings:

  - A unique constraint covering the columns `[id,periode_id]` on the table `distribusi_kebutuhan_dokumentasi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `periode_id` to the `distribusi_kebutuhan_dokumentasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `distribusi_kebutuhan_dokumentasi` ADD COLUMN `periode_id` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- CreateIndex
CREATE UNIQUE INDEX `distribusi_kebutuhan_dokumentasi_id_periode_id_key` ON `distribusi_kebutuhan_dokumentasi`(`id`, `periode_id`);

-- AddForeignKey
ALTER TABLE `distribusi_kebutuhan_dokumentasi` ADD CONSTRAINT `distribusi_kebutuhan_dokumentasi_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
