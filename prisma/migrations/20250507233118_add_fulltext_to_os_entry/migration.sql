-- DropIndex
DROP INDEX `OsEntry_version_build_idx` ON `OsEntry`;

-- CreateIndex
CREATE FULLTEXT INDEX `OsEntry_name_version_build_idx` ON `OsEntry`(`name`, `version`, `build`);
