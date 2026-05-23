/*
  Warnings:

  - Made the column `is_active_deadline_dokumentasi_borang` on table `timeline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active_deadline_kebutuhan_dokumentasi` on table `timeline` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `timeline` MODIFY `is_active_deadline_dokumentasi_borang` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `is_active_deadline_kebutuhan_dokumentasi` BOOLEAN NOT NULL DEFAULT false;
