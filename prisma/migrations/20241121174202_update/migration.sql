/*
  Warnings:

  - You are about to alter the column `content` on the `post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biography` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `Media_postId_fkey`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `summary` VARCHAR(191) NOT NULL,
    MODIFY `content` JSON NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `biography` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `media`;
