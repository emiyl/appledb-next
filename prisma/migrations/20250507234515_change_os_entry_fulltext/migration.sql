-- DropIndex
DROP INDEX `OsEntry_search_idx` ON `OsEntry`;

-- CreateIndex
CREATE FULLTEXT INDEX `search` ON `OsEntry`(`search`, `version`, `build`);
