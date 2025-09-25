/*
  Warnings:

  - You are about to drop the column `image` on the `testmonial` table. All the data in the column will be lost.
  - You are about to drop the `patner` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `blog` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `testmonial` DROP COLUMN `image`,
    ADD COLUMN `profileImage` VARCHAR(191) NULL,
    MODIFY `rate` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `patner`;

-- CreateTable
CREATE TABLE `partner` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
