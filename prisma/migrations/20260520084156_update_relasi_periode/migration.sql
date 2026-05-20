/*
  Warnings:

  - A unique constraint covering the columns `[periode_id]` on the table `distribusi_kebutuhan_dokumentasi` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `distribusi_kebutuhan_dokumentasi_id_periode_id_key` ON `distribusi_kebutuhan_dokumentasi`;

-- CreateIndex
CREATE UNIQUE INDEX `distribusi_kebutuhan_dokumentasi_periode_id_key` ON `distribusi_kebutuhan_dokumentasi`(`periode_id`);
