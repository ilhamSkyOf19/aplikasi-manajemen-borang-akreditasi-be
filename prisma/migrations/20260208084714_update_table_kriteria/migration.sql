/*
  Warnings:

  - You are about to alter the column `kriteria` on the `kriteria` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[kriteria]` on the table `Kriteria` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `kriteria` MODIFY `kriteria` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Kriteria_kriteria_key` ON `Kriteria`(`kriteria`);
