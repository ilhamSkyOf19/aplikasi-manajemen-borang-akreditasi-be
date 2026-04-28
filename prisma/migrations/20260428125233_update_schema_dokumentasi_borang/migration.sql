/*
  Warnings:

  - You are about to drop the column `keterangan` on the `dokumentasi_borang` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kebutuhan_dokumentasi_id]` on the table `dokumentasi_borang` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `keterangan` to the `file_dokumen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dokumentasi_borang` DROP COLUMN `keterangan`;

-- AlterTable
ALTER TABLE `file_dokumen` ADD COLUMN `keterangan` VARCHAR(1000) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `dokumentasi_borang_kebutuhan_dokumentasi_id_key` ON `dokumentasi_borang`(`kebutuhan_dokumentasi_id`);
