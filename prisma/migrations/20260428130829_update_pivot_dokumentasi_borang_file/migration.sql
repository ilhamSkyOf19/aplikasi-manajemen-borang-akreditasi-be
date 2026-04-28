/*
  Warnings:

  - You are about to drop the column `keterangan` on the `dokumentasi_borang_file` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `dokumentasi_borang_file` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dokumentasi_borang_file` DROP COLUMN `keterangan`,
    DROP COLUMN `status`;
