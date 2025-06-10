export type DeviceEntry = {
    id: number;
    name: string;
    category_id: number;
    image_id: number | null;
    is_internal: boolean;
    DeviceLookupImage: {
        name: string;
    }
    image: string;
};