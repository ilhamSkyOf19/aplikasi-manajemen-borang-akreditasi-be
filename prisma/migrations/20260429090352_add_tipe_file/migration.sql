/*
  Warnings:

  - Added the required column `tipe_file` to the `file_dokumen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file_dokumen` ADD COLUMN `tipe_file` ENUM('DEFAULT', 'PENELITIAN') NOT NULL;
