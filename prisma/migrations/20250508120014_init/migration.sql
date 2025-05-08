-- CreateTable
CREATE TABLE "ColorLookup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ColorLookup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceEntry" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "image_id" INTEGER,
    "is_internal" BOOLEAN DEFAULT false,
    "legacy_unique_key" TEXT,

    CONSTRAINT "DeviceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceGroupEntry" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "category_id" INTEGER,
    "image_id" INTEGER,
    "is_internal" BOOLEAN DEFAULT false,
    "legacy_unique_key" TEXT,

    CONSTRAINT "DeviceGroupEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceGroupMapDevice" (
    "group_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,

    CONSTRAINT "DeviceGroupMapDevice_pkey" PRIMARY KEY ("group_id","device_id")
);

-- CreateTable
CREATE TABLE "DeviceGroupMapDeviceGroup" (
    "parent_group_id" INTEGER NOT NULL,
    "child_group_id" INTEGER NOT NULL,

    CONSTRAINT "DeviceGroupMapDeviceGroup_pkey" PRIMARY KEY ("parent_group_id","child_group_id")
);

-- CreateTable
CREATE TABLE "DeviceImageColors" (
    "device_image_id" INTEGER NOT NULL,
    "color_id" INTEGER NOT NULL,
    "dark_mode" BOOLEAN DEFAULT false,

    CONSTRAINT "DeviceImageColors_pkey" PRIMARY KEY ("device_image_id","color_id")
);

-- CreateTable
CREATE TABLE "DeviceLookupArchitecture" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DeviceLookupArchitecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceLookupCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DeviceLookupCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceLookupImage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DeviceLookupImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceLookupSoc" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DeviceLookupSoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceMapArchitecture" (
    "device_id" INTEGER NOT NULL,
    "architecture_id" INTEGER NOT NULL,

    CONSTRAINT "DeviceMapArchitecture_pkey" PRIMARY KEY ("device_id","architecture_id")
);

-- CreateTable
CREATE TABLE "DeviceMapIdentifier" (
    "device_id" INTEGER NOT NULL,
    "identifier" VARCHAR(512) NOT NULL,

    CONSTRAINT "DeviceMapIdentifier_pkey" PRIMARY KEY ("device_id","identifier")
);

-- CreateTable
CREATE TABLE "DeviceMapModel" (
    "device_id" INTEGER NOT NULL,
    "model" VARCHAR(512) NOT NULL,

    CONSTRAINT "DeviceMapModel_pkey" PRIMARY KEY ("device_id","model")
);

-- CreateTable
CREATE TABLE "DeviceMapRelease" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER,
    "datetime" TIMESTAMP(3),
    "depth" INTEGER DEFAULT 3,

    CONSTRAINT "DeviceMapRelease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceMapSoc" (
    "device_id" INTEGER NOT NULL,
    "soc_id" INTEGER NOT NULL,

    CONSTRAINT "DeviceMapSoc_pkey" PRIMARY KEY ("device_id","soc_id")
);

-- CreateTable
CREATE TABLE "MapDeviceOs" (
    "device_id" INTEGER NOT NULL,
    "os_id" INTEGER NOT NULL,

    CONSTRAINT "MapDeviceOs_pkey" PRIMARY KEY ("device_id","os_id")
);

-- CreateTable
CREATE TABLE "OsEntry" (
    "id" SERIAL NOT NULL,
    "name_id" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "build" TEXT,
    "release_datetime" TIMESTAMP(3),
    "release_datetime_depth" INTEGER DEFAULT 3,
    "is_release" BOOLEAN DEFAULT true,
    "is_beta" BOOLEAN DEFAULT false,
    "is_rc" BOOLEAN DEFAULT false,
    "is_internal" BOOLEAN DEFAULT false,
    "is_rsr" BOOLEAN DEFAULT false,
    "is_sdk" BOOLEAN DEFAULT false,
    "is_simulator" BOOLEAN DEFAULT false,
    "image_id" TEXT,
    "embedded_os_build" TEXT,
    "bridge_os_build" TEXT,
    "notes" TEXT,
    "legacy_unique_key" TEXT,
    "search" TEXT,

    CONSTRAINT "OsEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OsEntryBuildTrain" (
    "os_id" INTEGER NOT NULL,
    "build_train" VARCHAR(512) NOT NULL,

    CONSTRAINT "OsEntryBuildTrain_pkey" PRIMARY KEY ("os_id","build_train")
);

-- CreateTable
CREATE TABLE "OsEntryIpd" (
    "os_id" INTEGER NOT NULL,
    "ipd_type" VARCHAR(512) NOT NULL,
    "url" TEXT,
    "active" BOOLEAN,

    CONSTRAINT "OsEntryIpd_pkey" PRIMARY KEY ("os_id","ipd_type")
);

-- CreateTable
CREATE TABLE "OsEntryOsStringMap" (
    "os_id" INTEGER NOT NULL,
    "os_string" VARCHAR(512) NOT NULL,

    CONSTRAINT "OsEntryOsStringMap_pkey" PRIMARY KEY ("os_id","os_string")
);

-- CreateTable
CREATE TABLE "OsEntryPreinstalled" (
    "os_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,

    CONSTRAINT "OsEntryPreinstalled_pkey" PRIMARY KEY ("os_id","device_id")
);

-- CreateTable
CREATE TABLE "OsEntryReleaseNote" (
    "os_id" INTEGER NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "active" BOOLEAN,

    CONSTRAINT "OsEntryReleaseNote_pkey" PRIMARY KEY ("os_id","url")
);

-- CreateTable
CREATE TABLE "OsEntrySafariVersion" (
    "os_id" INTEGER NOT NULL,
    "version" VARCHAR(512) NOT NULL,

    CONSTRAINT "OsEntrySafariVersion_pkey" PRIMARY KEY ("os_id","version")
);

-- CreateTable
CREATE TABLE "OsEntrySecurityNote" (
    "os_id" INTEGER NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "active" BOOLEAN,

    CONSTRAINT "OsEntrySecurityNote_pkey" PRIMARY KEY ("os_id","url")
);

-- CreateTable
CREATE TABLE "OsLookupName" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER DEFAULT 0,

    CONSTRAINT "OsLookupName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceEntry" (
    "id" SERIAL NOT NULL,
    "os_id" INTEGER,
    "source_type" TEXT,
    "skip_update_links" BOOLEAN,
    "size" BIGINT,
    "windows_update_id" TEXT,
    "windows_revision_id" TEXT,

    CONSTRAINT "SourceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceHash" (
    "source_id" INTEGER NOT NULL,
    "hash_type" VARCHAR(512) NOT NULL,
    "hash_value" TEXT,

    CONSTRAINT "SourceHash_pkey" PRIMARY KEY ("source_id","hash_type")
);

-- CreateTable
CREATE TABLE "SourceLink" (
    "source_id" INTEGER NOT NULL,
    "url" VARCHAR(512) NOT NULL,
    "active" BOOLEAN,

    CONSTRAINT "SourceLink_pkey" PRIMARY KEY ("source_id","url")
);

-- CreateTable
CREATE TABLE "SourceMapDevice" (
    "source_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,

    CONSTRAINT "SourceMapDevice_pkey" PRIMARY KEY ("source_id","device_id")
);

-- CreateTable
CREATE TABLE "SourceMapOsString" (
    "source_id" INTEGER NOT NULL,
    "os_string" VARCHAR(512) NOT NULL,

    CONSTRAINT "SourceMapOsString_pkey" PRIMARY KEY ("source_id","os_string")
);

-- CreateTable
CREATE TABLE "SourcePrequisiteBuild" (
    "source_id" INTEGER NOT NULL,
    "build" VARCHAR(512) NOT NULL,

    CONSTRAINT "SourcePrequisiteBuild_pkey" PRIMARY KEY ("source_id","build")
);

-- CreateIndex
CREATE INDEX "DeviceEntry_category_id_idx" ON "DeviceEntry"("category_id");

-- CreateIndex
CREATE INDEX "DeviceGroupMapDevice_device_id_idx" ON "DeviceGroupMapDevice"("device_id");

-- CreateIndex
CREATE INDEX "DeviceGroupMapDeviceGroup_child_group_id_idx" ON "DeviceGroupMapDeviceGroup"("child_group_id");

-- CreateIndex
CREATE INDEX "DeviceImageColors_color_id_idx" ON "DeviceImageColors"("color_id");

-- CreateIndex
CREATE INDEX "DeviceMapArchitecture_architecture_id_idx" ON "DeviceMapArchitecture"("architecture_id");

-- CreateIndex
CREATE INDEX "DeviceMapRelease_device_id_idx" ON "DeviceMapRelease"("device_id");

-- CreateIndex
CREATE INDEX "DeviceMapSoc_soc_id_idx" ON "DeviceMapSoc"("soc_id");

-- CreateIndex
CREATE INDEX "MapDeviceOs_os_id_idx" ON "MapDeviceOs"("os_id");

-- CreateIndex
CREATE INDEX "OsEntry_name_id_idx" ON "OsEntry"("name_id");

-- CreateIndex
CREATE INDEX "OsEntryPreinstalled_device_id_idx" ON "OsEntryPreinstalled"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "OsLookupName_name_key" ON "OsLookupName"("name");

-- CreateIndex
CREATE INDEX "SourceEntry_os_id_idx" ON "SourceEntry"("os_id");

-- CreateIndex
CREATE INDEX "SourceMapDevice_device_id_idx" ON "SourceMapDevice"("device_id");

-- AddForeignKey
ALTER TABLE "DeviceEntry" ADD CONSTRAINT "DeviceEntry_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "DeviceLookupCategory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceGroupMapDevice" ADD CONSTRAINT "DeviceGroupMapDevice_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "DeviceGroupEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceGroupMapDevice" ADD CONSTRAINT "DeviceGroupMapDevice_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceGroupMapDeviceGroup" ADD CONSTRAINT "DeviceGroupMapDeviceGroup_parent_group_id_fkey" FOREIGN KEY ("parent_group_id") REFERENCES "DeviceGroupEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceGroupMapDeviceGroup" ADD CONSTRAINT "DeviceGroupMapDeviceGroup_child_group_id_fkey" FOREIGN KEY ("child_group_id") REFERENCES "DeviceGroupEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceImageColors" ADD CONSTRAINT "DeviceImageColors_device_image_id_fkey" FOREIGN KEY ("device_image_id") REFERENCES "DeviceLookupImage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceImageColors" ADD CONSTRAINT "DeviceImageColors_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "ColorLookup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceMapArchitecture" ADD CONSTRAINT "DeviceMapArchitecture_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceMapArchitecture" ADD CONSTRAINT "DeviceMapArchitecture_architecture_id_fkey" FOREIGN KEY ("architecture_id") REFERENCES "DeviceLookupArchitecture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceMapIdentifier" ADD CONSTRAINT "DeviceMapIdentifier_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceMapModel" ADD CONSTRAINT "DeviceMapModel_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceMapRelease" ADD CONSTRAINT "DeviceMapRelease_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceMapSoc" ADD CONSTRAINT "DeviceMapSoc_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DeviceMapSoc" ADD CONSTRAINT "DeviceMapSoc_soc_id_fkey" FOREIGN KEY ("soc_id") REFERENCES "DeviceLookupSoc"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MapDeviceOs" ADD CONSTRAINT "MapDeviceOs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MapDeviceOs" ADD CONSTRAINT "MapDeviceOs_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OsEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OsEntry" ADD CONSTRAINT "OsEntry_name_id_fkey" FOREIGN KEY ("name_id") REFERENCES "OsLookupName"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OsEntryBuildTrain" ADD CONSTRAINT "OsEntryBuildTrain_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OsEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OsEntryIpd" ADD CONSTRAINT "OsEntryIpd_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OsEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OsEntryOsStringMap" ADD CONSTRAINT "OsEntryOsStringMap_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OsEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OsEntryPreinstalled" ADD CONSTRAINT "OsEntryPreinstalled_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OsEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OsEntryPreinstalled" ADD CONSTRAINT "OsEntryPreinstalled_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OsEntryReleaseNote" ADD CONSTRAINT "OsEntryReleaseNote_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OsEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OsEntrySafariVersion" ADD CONSTRAINT "OsEntrySafariVersion_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OsEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OsEntrySecurityNote" ADD CONSTRAINT "OsEntrySecurityNote_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OsEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SourceEntry" ADD CONSTRAINT "SourceEntry_os_id_fkey" FOREIGN KEY ("os_id") REFERENCES "OsEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SourceHash" ADD CONSTRAINT "SourceHash_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "SourceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SourceLink" ADD CONSTRAINT "SourceLink_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "SourceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SourceMapDevice" ADD CONSTRAINT "SourceMapDevice_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "SourceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SourceMapDevice" ADD CONSTRAINT "SourceMapDevice_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SourcePrequisiteBuild" ADD CONSTRAINT "SourcePrequisiteBuild_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "SourceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
