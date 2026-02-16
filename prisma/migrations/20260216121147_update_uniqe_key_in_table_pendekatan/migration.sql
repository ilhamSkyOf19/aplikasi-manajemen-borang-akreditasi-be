/*
  Warnings:

  - A unique constraint covering the columns `[keterangan]` on the table `pendekatan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `pendekatan_tahap_key` ON `pendekatan`;

-- CreateIndex
CREATE UNIQUE INDEX `pendekatan_keterangan_key` ON `pendekatan`(`keterangan`);
