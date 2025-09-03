import { OsEntryReleaseKind } from './OsEntryReleaseKind';

export type EntryListFilterItem = {
    [filterName: string]: {
        label: string;
        contents: { id: number, name: string }[];
        active: { id: number, name: string }[];
        hidden: boolean;
        webParam?: string;
        apiParam?: string;
        apiRoute?: string | undefined;
    };
};

export type OsEntryListFilter = {
    releaseKinds: {
        [key in OsEntryReleaseKind]: boolean;
    },
    search: string;
    filters: EntryListFilterItem;
};

export type DeviceEntryListFilter = {
    search: string;
    filters: EntryListFilterItem;
};

export type EntryListFilter = OsEntryListFilter | DeviceEntryListFilter;