/*
  Warnings:

  - You are about to drop the column `provider_file_id` on the `file_dokumen` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_id]` on the table `file_dokumen` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_id` to the `file_dokumen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file_dokumen` DROP COLUMN `provider_file_id`,
    ADD COLUMN `file_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `file_dokumen_file_id_key` ON `file_dokumen`(`file_id`);
