-- DropForeignKey
ALTER TABLE `personas` DROP FOREIGN KEY `Personas_municipio_fkey`;

-- AlterTable
ALTER TABLE `personas` MODIFY `municipio` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Personas` ADD CONSTRAINT `Personas_municipio_fkey` FOREIGN KEY (`municipio`) REFERENCES `Municipios`(`id_municipio`) ON DELETE SET NULL ON UPDATE CASCADE;
