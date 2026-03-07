/*
  Warnings:

  - You are about to drop the `pic_pj` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pic_pj` DROP FOREIGN KEY `pic_pj_picId_fkey`;

-- DropForeignKey
ALTER TABLE `pic_pj` DROP FOREIGN KEY `pic_pj_userId_fkey`;

-- DropTable
DROP TABLE `pic_pj`;
