-- AlterTable
ALTER TABLE `riwayat` ADD COLUMN `dokumentasi_borang_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `riwayat` ADD CONSTRAINT `riwayat_dokumentasi_borang_id_fkey` FOREIGN KEY (`dokumentasi_borang_id`) REFERENCES `dokumentasi_borang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
