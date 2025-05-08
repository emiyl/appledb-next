-- DropIndex
DROP INDEX `search` ON `OsEntry`;

-- CreateIndex
CREATE FULLTEXT INDEX `search` ON `OsEntry`(`search`);
