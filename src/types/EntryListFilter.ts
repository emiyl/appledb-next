import { OsEntryReleaseKind } from './OsEntryReleaseKind';

export type EntryListFilterItem = {
    [filterName: string]: {
        label: string;
        contents: { id: number, name: string }[];
        active: { id: number, name: string }[];
        hidden: boolean;
        param?: string;
        apiRoute?: string | undefined;
    };
};

export type OsEntryListFilter = {
    releaseKinds: {
        [key in OsEntryReleaseKind]: boolean;
    },
    search: string;
    filters: EntryListFilterItem;
    filter_id: number[];
    device_id: number[];
};

export type DeviceEntryListFilter = {
    search: string;
    filters: EntryListFilterItem;
    filter_id: number[];
};

export type EntryListFilter = OsEntryListFilter | DeviceEntryListFilter;