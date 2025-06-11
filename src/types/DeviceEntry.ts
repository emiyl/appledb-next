import { ColorLookup } from './../generated/prisma/index.d';
export type DeviceEntry = {
    id: number;
    name: string;
    category_id: number;
    image_id: number | null;
    is_internal: boolean;
    DeviceLookupImage: {
        name: string;
        DeviceImageColors: {
            color_id: number;
            dark_mode: boolean;
            ColorLookup: {
                name: string;
            };
        }[];
    };
    image: string;
};