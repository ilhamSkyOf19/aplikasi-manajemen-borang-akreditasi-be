/*
  Warnings:

  - You are about to drop the `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kebutuhan_dokumentasi_pic` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kriteria_id,pendekatan_id,nama_kebutuhan_dokumentasi_id]` on the table `kebutuhan_dokumentasi` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi` DROP FOREIGN KEY `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi_kebutuhan__fkey`;

-- DropForeignKey
ALTER TABLE `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi` DROP FOREIGN KEY `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi_nama_kebut_fkey`;

-- DropForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` DROP FOREIGN KEY `kebutuhan_dokumentasi_pic_kebutuhan_dokumentasi_id_fkey`;

-- DropForeignKey
ALTER TABLE `kebutuhan_dokumentasi_pic` DROP FOREIGN KEY `kebutuhan_dokumentasi_pic_pic_id_fkey`;

-- DropTable
DROP TABLE `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi`;

-- DropTable
DROP TABLE `kebutuhan_dokumentasi_pic`;

-- CreateIndex
CREATE UNIQUE INDEX `kebutuhan_dokumentasi_kriteria_id_pendekatan_id_nama_kebutuh_key` ON `kebutuhan_dokumentasi`(`kriteria_id`, `pendekatan_id`, `nama_kebutuhan_dokumentasi_id`);

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi` ADD CONSTRAINT `kebutuhan_dokumentasi_nama_kebutuhan_dokumentasi_id_fkey` FOREIGN KEY (`nama_kebutuhan_dokumentasi_id`) REFERENCES `nama_kebutuhan_dokumentasi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kebutuhan_dokumentasi` ADD CONSTRAINT `kebutuhan_dokumentasi_pic_id_fkey` FOREIGN KEY (`pic_id`) REFERENCES `pic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
