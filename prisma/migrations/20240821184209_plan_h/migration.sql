-- AlterTable
ALTER TABLE `ambientes` MODIFY `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo';

-- AlterTable
ALTER TABLE `programas` MODIFY `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo';
