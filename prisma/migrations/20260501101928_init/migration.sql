/*
  Warnings:

  - A unique constraint covering the columns `[nama_kriteria]` on the table `kriteria` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `kriteria_nama_kriteria_key` ON `kriteria`(`nama_kriteria`);
