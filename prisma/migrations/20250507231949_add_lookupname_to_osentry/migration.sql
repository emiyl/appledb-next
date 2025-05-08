-- CreateTable
CREATE TABLE `ColorLookup` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceEntry` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(512) NOT NULL,
    `category_id` INTEGER UNSIGNED NOT NULL,
    `image_id` INTEGER UNSIGNED NULL,
    `is_internal` BOOLEAN NULL DEFAULT false,
    `legacy_unique_key` TEXT NULL,

    INDEX `category_id`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceGroupEntry` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(512) NOT NULL,
    `category_id` INTEGER UNSIGNED NULL,
    `image_id` INTEGER UNSIGNED NULL,
    `is_internal` BOOLEAN NULL DEFAULT false,
    `legacy_unique_key` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceGroupMapDevice` (
    `group_id` INTEGER UNSIGNED NOT NULL,
    `device_id` INTEGER UNSIGNED NOT NULL,

    INDEX `device_id`(`device_id`),
    PRIMARY KEY (`group_id`, `device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceGroupMapDeviceGroup` (
    `parent_group_id` INTEGER UNSIGNED NOT NULL,
    `child_group_id` INTEGER UNSIGNED NOT NULL,

    INDEX `child_group_id`(`child_group_id`),
    PRIMARY KEY (`parent_group_id`, `child_group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceImageColors` (
    `device_image_id` INTEGER UNSIGNED NOT NULL,
    `color_id` INTEGER UNSIGNED NOT NULL,
    `dark_mode` BOOLEAN NULL DEFAULT false,

    INDEX `color_id`(`color_id`),
    PRIMARY KEY (`device_image_id`, `color_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceLookupArchitecture` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceLookupCategory` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceLookupImage` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceLookupSoc` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceMapArchitecture` (
    `device_id` INTEGER UNSIGNED NOT NULL,
    `architecture_id` INTEGER UNSIGNED NOT NULL,

    INDEX `architecture_id`(`architecture_id`),
    PRIMARY KEY (`device_id`, `architecture_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceMapIdentifier` (
    `device_id` INTEGER UNSIGNED NOT NULL,
    `identifier` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`device_id`, `identifier`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceMapModel` (
    `device_id` INTEGER UNSIGNED NOT NULL,
    `model` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`device_id`, `model`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceMapRelease` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `device_id` INTEGER UNSIGNED NULL,
    `datetime` DATETIME(0) NULL,
    `depth` INTEGER UNSIGNED NULL DEFAULT 3,

    INDEX `device_id`(`device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceMapSoc` (
    `device_id` INTEGER UNSIGNED NOT NULL,
    `soc_id` INTEGER UNSIGNED NOT NULL,

    INDEX `soc_id`(`soc_id`),
    PRIMARY KEY (`device_id`, `soc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MapDeviceOs` (
    `device_id` INTEGER UNSIGNED NOT NULL,
    `os_id` INTEGER UNSIGNED NOT NULL,

    INDEX `os_id`(`os_id`),
    PRIMARY KEY (`device_id`, `os_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsEntry` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(512) NOT NULL,
    `version` TEXT NOT NULL,
    `build` TEXT NULL,
    `release_datetime` DATETIME(0) NULL,
    `release_datetime_depth` INTEGER UNSIGNED NULL DEFAULT 3,
    `is_release` BOOLEAN NULL DEFAULT true,
    `is_beta` BOOLEAN NULL DEFAULT false,
    `is_rc` BOOLEAN NULL DEFAULT false,
    `is_internal` BOOLEAN NULL DEFAULT false,
    `is_rsr` BOOLEAN NULL DEFAULT false,
    `is_sdk` BOOLEAN NULL DEFAULT false,
    `is_simulator` BOOLEAN NULL DEFAULT false,
    `image_id` TEXT NULL,
    `embedded_os_build` TEXT NULL,
    `bridge_os_build` TEXT NULL,
    `notes` TEXT NULL,
    `legacy_unique_key` TEXT NULL,

    INDEX `name_id`(`name_id`),
    FULLTEXT INDEX `OsEntry_version_build_idx`(`version`, `build`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsEntryBuildTrain` (
    `os_id` INTEGER UNSIGNED NOT NULL,
    `build_train` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`os_id`, `build_train`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsEntryIpd` (
    `os_id` INTEGER UNSIGNED NOT NULL,
    `ipd_type` VARCHAR(512) NOT NULL,
    `url` TEXT NULL,
    `active` BOOLEAN NULL,

    PRIMARY KEY (`os_id`, `ipd_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsEntryOsStringMap` (
    `os_id` INTEGER UNSIGNED NOT NULL,
    `os_string` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`os_id`, `os_string`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsEntryPreinstalled` (
    `os_id` INTEGER UNSIGNED NOT NULL,
    `device_id` INTEGER UNSIGNED NOT NULL,

    INDEX `device_id`(`device_id`),
    PRIMARY KEY (`os_id`, `device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsEntryReleaseNote` (
    `os_id` INTEGER UNSIGNED NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `active` BOOLEAN NULL,

    PRIMARY KEY (`os_id`, `url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsEntrySafariVersion` (
    `os_id` INTEGER UNSIGNED NOT NULL,
    `version` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`os_id`, `version`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsEntrySecurityNote` (
    `os_id` INTEGER UNSIGNED NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `active` BOOLEAN NULL,

    PRIMARY KEY (`os_id`, `url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsLookupName` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(512) NOT NULL,
    `priority` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SourceEntry` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `os_id` INTEGER UNSIGNED NULL,
    `source_type` TEXT NULL,
    `skip_update_links` BOOLEAN NULL,
    `size` BIGINT UNSIGNED NULL,
    `windows_update_id` TEXT NULL,
    `windows_revision_id` TEXT NULL,

    INDEX `os_id`(`os_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SourceHash` (
    `source_id` INTEGER UNSIGNED NOT NULL,
    `hash_type` VARCHAR(512) NOT NULL,
    `hash_value` TEXT NULL,

    PRIMARY KEY (`source_id`, `hash_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SourceLink` (
    `source_id` INTEGER UNSIGNED NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `active` BOOLEAN NULL,

    PRIMARY KEY (`source_id`, `url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SourceMapDevice` (
    `source_id` INTEGER UNSIGNED NOT NULL,
    `device_id` INTEGER UNSIGNED NOT NULL,

    INDEX `device_id`(`device_id`),
    PRIMARY KEY (`source_id`, `device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SourceMapOsString` (
    `source_id` INTEGER UNSIGNED NOT NULL,
    `os_string` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`source_id`, `os_string`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SourcePrequisiteBuild` (
    `source_id` INTEGER UNSIGNED NOT NULL,
    `build` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`source_id`, `build`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DeviceEntry` ADD CONSTRAINT `deviceentry_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `DeviceLookupCategory`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceGroupMapDevice` ADD CONSTRAINT `devicegroupmapdevice_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `DeviceGroupEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceGroupMapDevice` ADD CONSTRAINT `devicegroupmapdevice_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `DeviceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceGroupMapDeviceGroup` ADD CONSTRAINT `devicegroupmapdevicegroup_ibfk_1` FOREIGN KEY (`parent_group_id`) REFERENCES `DeviceGroupEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceGroupMapDeviceGroup` ADD CONSTRAINT `devicegroupmapdevicegroup_ibfk_2` FOREIGN KEY (`child_group_id`) REFERENCES `DeviceGroupEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceImageColors` ADD CONSTRAINT `deviceimagecolors_ibfk_1` FOREIGN KEY (`device_image_id`) REFERENCES `DeviceLookupImage`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceImageColors` ADD CONSTRAINT `deviceimagecolors_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `ColorLookup`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceMapArchitecture` ADD CONSTRAINT `devicemaparchitecture_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `DeviceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceMapArchitecture` ADD CONSTRAINT `devicemaparchitecture_ibfk_2` FOREIGN KEY (`architecture_id`) REFERENCES `DeviceLookupArchitecture`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceMapIdentifier` ADD CONSTRAINT `devicemapidentifier_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `DeviceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceMapModel` ADD CONSTRAINT `devicemapmodel_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `DeviceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceMapRelease` ADD CONSTRAINT `devicemaprelease_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `DeviceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceMapSoc` ADD CONSTRAINT `devicemapsoc_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `DeviceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeviceMapSoc` ADD CONSTRAINT `devicemapsoc_ibfk_2` FOREIGN KEY (`soc_id`) REFERENCES `DeviceLookupSoc`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `MapDeviceOs` ADD CONSTRAINT `mapdeviceos_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `DeviceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `MapDeviceOs` ADD CONSTRAINT `mapdeviceos_ibfk_2` FOREIGN KEY (`os_id`) REFERENCES `OsEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OsEntry` ADD CONSTRAINT `osentry_ibfk_1` FOREIGN KEY (`name_id`) REFERENCES `OsLookupName`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OsEntryBuildTrain` ADD CONSTRAINT `osentrybuildtrain_ibfk_1` FOREIGN KEY (`os_id`) REFERENCES `OsEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OsEntryIpd` ADD CONSTRAINT `osentryipd_ibfk_1` FOREIGN KEY (`os_id`) REFERENCES `OsEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OsEntryOsStringMap` ADD CONSTRAINT `osentryosstringmap_ibfk_1` FOREIGN KEY (`os_id`) REFERENCES `OsEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OsEntryPreinstalled` ADD CONSTRAINT `osentrypreinstalled_ibfk_1` FOREIGN KEY (`os_id`) REFERENCES `OsEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OsEntryPreinstalled` ADD CONSTRAINT `osentrypreinstalled_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `DeviceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OsEntryReleaseNote` ADD CONSTRAINT `osentryreleasenote_ibfk_1` FOREIGN KEY (`os_id`) REFERENCES `OsEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OsEntrySafariVersion` ADD CONSTRAINT `osentrysafariversion_ibfk_1` FOREIGN KEY (`os_id`) REFERENCES `OsEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OsEntrySecurityNote` ADD CONSTRAINT `osentrysecuritynote_ibfk_1` FOREIGN KEY (`os_id`) REFERENCES `OsEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SourceEntry` ADD CONSTRAINT `sourceentry_ibfk_1` FOREIGN KEY (`os_id`) REFERENCES `OsEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SourceHash` ADD CONSTRAINT `sourcehash_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `SourceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SourceLink` ADD CONSTRAINT `sourcelink_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `SourceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SourceMapDevice` ADD CONSTRAINT `sourcemapdevice_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `SourceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SourceMapDevice` ADD CONSTRAINT `sourcemapdevice_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `DeviceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SourcePrequisiteBuild` ADD CONSTRAINT `sourceprequisitebuild_ibfk_1` FOREIGN KEY (`source_id`) REFERENCES `SourceEntry`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
