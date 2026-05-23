-- AlterTable
ALTER TABLE `dokumen_panduan` ADD COLUMN `storage_provider` ENUM('GDRIVE', 'SISTEM') NOT NULL DEFAULT 'SISTEM';

-- AlterTable
ALTER TABLE `timeline` ADD COLUMN `is_active_deadline_dokumentasi_borang` BOOLEAN NULL,
    ADD COLUMN `is_active_deadline_kebutuhan_dokumentasi` BOOLEAN NULL;
