-- DropForeignKey
ALTER TABLE `file_dokumen` DROP FOREIGN KEY `file_dokumen_uploaded_by_id_fkey`;

-- AlterTable
ALTER TABLE `file_dokumen` MODIFY `uploaded_by_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `file_dokumen` ADD CONSTRAINT `file_dokumen_uploaded_by_id_fkey` FOREIGN KEY (`uploaded_by_id`) REFERENCES `dosen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
