import { OsEntryReleaseKind } from './OsEntryReleaseKind';

export type OsEntryListFilter = {
    releaseKinds: {
        [key in OsEntryReleaseKind]: boolean;
    },
    search: string;
    name_id: number[];
}

export type DeviceEntryListFilter = {
    search: string;
    category_id: number[];
}

export type EntryListFilter = OsEntryListFilter | DeviceEntryListFilter;