/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `dokumen_borang` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[file_id]` on the table `dokumen_borang` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `dokumen_borang` ADD COLUMN `file_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `dokumen_borang_filename_key` ON `dokumen_borang`(`filename`);

-- CreateIndex
CREATE UNIQUE INDEX `dokumen_borang_file_id_key` ON `dokumen_borang`(`file_id`);
