/*
  Warnings:

  - You are about to drop the column `kriteri_id` on the `kriteria_pic` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kriteria_id,dosen_id]` on the table `kriteria_pic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kriteria_id` to the `kriteria_pic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `kriteria_pic` DROP FOREIGN KEY `kriteria_pic_kriteri_id_fkey`;

-- DropIndex
DROP INDEX `kriteria_pic_kriteri_id_dosen_id_key` ON `kriteria_pic`;

-- AlterTable
ALTER TABLE `kriteria_pic` DROP COLUMN `kriteri_id`,
    ADD COLUMN `kriteria_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `kriteria_pic_kriteria_id_dosen_id_key` ON `kriteria_pic`(`kriteria_id`, `dosen_id`);

-- AddForeignKey
ALTER TABLE `kriteria_pic` ADD CONSTRAINT `kriteria_pic_kriteria_id_fkey` FOREIGN KEY (`kriteria_id`) REFERENCES `kriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
