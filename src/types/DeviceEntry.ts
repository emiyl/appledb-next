import { ColorLookup, DeviceMapIdentifier } from './../generated/prisma/index.d';
export type DeviceEntry = {
    id: number;
    name: string;
    category_id: number;
    image_id: number | null;
    is_internal: boolean;
    DeviceLookupCategory: {
        name: string;
    }
    DeviceLookupImage: {
        name: string;
        DeviceImageColors: {
            dark_mode: boolean;
            ColorLookup: {
                name: string;
            };
        }[];
    };
    DeviceMapArchitecture: {
        DeviceLookupArchitecture: {
            name: string;
        };
    }[];
    DeviceMapIdentifier: {
        identifier: string;
    }[];
    DeviceMapModel: {
        model: string;
    }[];
    DeviceMapRelease: {
        datetime: Date;
        depth: number;
    }[];
    DeviceMapSoc: {
        DeviceLookupSoc: {
            name: string;
        };
    }[];
};