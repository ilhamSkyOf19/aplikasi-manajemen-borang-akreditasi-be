/*
  Warnings:

  - A unique constraint covering the columns `[nama_file]` on the table `file_dokumen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `file_dokumen_nama_file_key` ON `file_dokumen`(`nama_file`);
