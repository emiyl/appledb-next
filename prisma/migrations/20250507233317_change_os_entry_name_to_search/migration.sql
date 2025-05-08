/*
  Warnings:

  - You are about to drop the column `name` on the `OsEntry` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `OsEntry_name_version_build_idx` ON `OsEntry`;

-- AlterTable
ALTER TABLE `OsEntry` DROP COLUMN `name`,
    ADD COLUMN `search` VARCHAR(512) NOT NULL DEFAULT 'Unknown';

-- CreateIndex
CREATE FULLTEXT INDEX `OsEntry_search_idx` ON `OsEntry`(`search`);
