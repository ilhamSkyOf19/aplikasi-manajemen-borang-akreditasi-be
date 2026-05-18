/*
  Warnings:

  - A unique constraint covering the columns `[start_date,end_date]` on the table `periode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `periode_start_date_end_date_key` ON `periode`(`start_date`, `end_date`);
