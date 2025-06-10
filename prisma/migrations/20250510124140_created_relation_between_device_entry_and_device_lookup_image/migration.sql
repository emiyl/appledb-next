-- AddForeignKey
ALTER TABLE "DeviceEntry" ADD CONSTRAINT "DeviceEntry_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "DeviceLookupImage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
