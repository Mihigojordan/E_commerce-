/*
  Warnings:

  - You are about to drop the column `fullName` on the `contactmessage` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `contactmessage` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contactmessage` DROP COLUMN `fullName`,
    DROP COLUMN `subject`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Testmonial` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `position` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `rate` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patner` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
