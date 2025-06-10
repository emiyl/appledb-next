-- RenameForeignKey
ALTER TABLE "DeviceEntry" RENAME CONSTRAINT "DeviceEntry_image_id_fkey" TO "DeviceEntry_image_id_lookup_fkey";

-- AddForeignKey
ALTER TABLE "DeviceImageColors" ADD CONSTRAINT "DeviceImageColors_device_image_id_to_DeviceEntry_fkey" FOREIGN KEY ("device_image_id") REFERENCES "DeviceEntry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
