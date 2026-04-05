/*
  Warnings:

  - You are about to drop the `riwayat_flag_revisi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `riwayat_flag_revisi` DROP FOREIGN KEY `riwayat_flag_revisi_riwayatId_fkey`;

-- DropTable
DROP TABLE `riwayat_flag_revisi`;
