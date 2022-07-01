-- CreateTable
CREATE TABLE `Photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `albumId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `thumbnailUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
