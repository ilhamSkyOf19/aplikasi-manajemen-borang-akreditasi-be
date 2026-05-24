-- AddForeignKey
ALTER TABLE `activation_code` ADD CONSTRAINT `activation_code_dosen_id_fkey` FOREIGN KEY (`dosen_id`) REFERENCES `dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
