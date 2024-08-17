/*
  Warnings:

  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropTable
DROP TABLE `post`;

-- DropTable
DROP TABLE `profile`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` VARCHAR(191) NOT NULL,
    `mail` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `num_tel` VARCHAR(191) NOT NULL,
    `adress` VARCHAR(191) NULL,
    `role` ENUM('CLIENT', 'COOPERATIVE') NOT NULL,
    `id_client` VARCHAR(191) NULL,
    `id_cooperative` VARCHAR(191) NULL,

    UNIQUE INDEX `Utilisateur_mail_key`(`mail`),
    UNIQUE INDEX `Utilisateur_num_tel_key`(`num_tel`),
    UNIQUE INDEX `Utilisateur_id_client_key`(`id_client`),
    UNIQUE INDEX `Utilisateur_id_cooperative_key`(`id_cooperative`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `cin` VARCHAR(191) NOT NULL,
    `close_num` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Client_cin_key`(`cin`),
    UNIQUE INDEX `Client_close_num_key`(`close_num`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cooperative` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id` VARCHAR(191) NOT NULL,
    `date_reservation` DATETIME(3) NOT NULL,
    `id_cooperative` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chauffeur` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `num_tel` VARCHAR(191) NOT NULL,
    `cin` VARCHAR(191) NOT NULL,
    `adress` VARCHAR(191) NOT NULL,
    `cooperativeId` VARCHAR(191) NULL,

    UNIQUE INDEX `Chauffeur_num_tel_key`(`num_tel`),
    UNIQUE INDEX `Chauffeur_cin_key`(`cin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voiture` (
    `id` VARCHAR(191) NOT NULL,
    `matricule` VARCHAR(191) NOT NULL,
    `id_chauffeur` VARCHAR(191) NOT NULL,
    `id_chauffeur2` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `cooperativeId` VARCHAR(191) NULL,

    UNIQUE INDEX `Voiture_matricule_key`(`matricule`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voyage` (
    `id` VARCHAR(191) NOT NULL,
    `start` DATETIME(3) NOT NULL,
    `arrived` DATETIME(3) NOT NULL,
    `id_reservation` VARCHAR(191) NOT NULL,
    `id_voiture` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Place` (
    `id` VARCHAR(191) NOT NULL,
    `num_place` INTEGER NOT NULL,
    `status` ENUM('LIBRE', 'ATTENTE', 'OCCUPE') NOT NULL,
    `coasts` INTEGER NOT NULL,
    `id_client` VARCHAR(191) NULL,
    `id_voyage` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Utilisateur` ADD CONSTRAINT `Utilisateur_id_cooperative_fkey` FOREIGN KEY (`id_cooperative`) REFERENCES `Cooperative`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_id_cooperative_fkey` FOREIGN KEY (`id_cooperative`) REFERENCES `Cooperative`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chauffeur` ADD CONSTRAINT `Chauffeur_cooperativeId_fkey` FOREIGN KEY (`cooperativeId`) REFERENCES `Cooperative`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voiture` ADD CONSTRAINT `Voiture_id_chauffeur_fkey` FOREIGN KEY (`id_chauffeur`) REFERENCES `Chauffeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voiture` ADD CONSTRAINT `Voiture_id_chauffeur2_fkey` FOREIGN KEY (`id_chauffeur2`) REFERENCES `Chauffeur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voiture` ADD CONSTRAINT `Voiture_cooperativeId_fkey` FOREIGN KEY (`cooperativeId`) REFERENCES `Cooperative`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voyage` ADD CONSTRAINT `Voyage_id_reservation_fkey` FOREIGN KEY (`id_reservation`) REFERENCES `Reservation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voyage` ADD CONSTRAINT `Voyage_id_voiture_fkey` FOREIGN KEY (`id_voiture`) REFERENCES `Voiture`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Place` ADD CONSTRAINT `Place_id_client_fkey` FOREIGN KEY (`id_client`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Place` ADD CONSTRAINT `Place_id_voyage_fkey` FOREIGN KEY (`id_voyage`) REFERENCES `Voyage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
