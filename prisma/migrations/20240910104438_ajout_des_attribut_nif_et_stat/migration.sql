/*
  Warnings:

  - Added the required column `centre` to the `Cooperative` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nif` to the `Cooperative` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stat` to the `Cooperative` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Chauffeur_cooperativeId_fkey` ON `chauffeur`;

-- DropIndex
DROP INDEX `Place_id_client_fkey` ON `place`;

-- DropIndex
DROP INDEX `Place_id_voyage_fkey` ON `place`;

-- DropIndex
DROP INDEX `Reservation_id_cooperative_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Voiture_cooperativeId_fkey` ON `voiture`;

-- DropIndex
DROP INDEX `Voiture_id_chauffeur2_fkey` ON `voiture`;

-- DropIndex
DROP INDEX `Voiture_id_chauffeur_fkey` ON `voiture`;

-- DropIndex
DROP INDEX `Voyage_id_reservation_fkey` ON `voyage`;

-- DropIndex
DROP INDEX `Voyage_id_voiture_fkey` ON `voyage`;

-- AlterTable
ALTER TABLE `cooperative` ADD COLUMN `centre` VARCHAR(191) NOT NULL,
    ADD COLUMN `nif` VARCHAR(191) NOT NULL,
    ADD COLUMN `stat` VARCHAR(191) NOT NULL;

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
