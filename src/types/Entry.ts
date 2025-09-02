export type OsEntry = {
    id: number;
    version: string;
    build: string;
    release_datetime: Date;
    release_datetime_depth: number;
    is_release: boolean;
    is_beta: boolean;
    is_rc: boolean;
    is_rsr: boolean;
    is_internal: boolean;
    is_sdk: boolean;
    is_simulator: boolean;
    OsLookupName: {
        name: string;
    };
};

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

export type Entry = OsEntry | DeviceEntry;