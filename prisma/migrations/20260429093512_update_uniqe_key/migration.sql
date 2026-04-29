/*
  Warnings:

  - A unique constraint covering the columns `[dokumentasi_borang_id,file_dokumen_id]` on the table `dokumentasi_borang_file` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `dokumentasi_borang_file` DROP FOREIGN KEY `dokumentasi_borang_file_dokumentasi_borang_id_fkey`;

-- DropIndex
DROP INDEX `dokumentasi_borang_file_dokumentasi_borang_id_file_dokumen_i_key` ON `dokumentasi_borang_file`;

-- CreateIndex
CREATE UNIQUE INDEX `dokumentasi_borang_file_dokumentasi_borang_id_file_dokumen_i_key` ON `dokumentasi_borang_file`(`dokumentasi_borang_id`, `file_dokumen_id`);


-- AddForeignKey
ALTER TABLE `dokumentasi_borang_file` 
ADD CONSTRAINT `dokumentasi_borang_file_dokumentasi_borang_id_fkey` 
FOREIGN KEY (`dokumentasi_borang_id`) REFERENCES `dokumentasi_borang`(`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;