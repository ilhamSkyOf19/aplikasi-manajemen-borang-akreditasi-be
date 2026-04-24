/*
  Warnings:

  - A unique constraint covering the columns `[nidn]` on the table `dosen` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nidn` to the `dosen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dosen` ADD COLUMN `nidn` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `dosen_nidn_key` ON `dosen`(`nidn`);
