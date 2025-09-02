import { OsEntryReleaseKind } from './OsEntryReleaseKind';

export type OsEntryListFilter = {
    releaseKinds: {
        [key in OsEntryReleaseKind]: boolean;
    },
    search: string;
    filter_id: number[];
}

export type DeviceEntryListFilter = {
    search: string;
    filter_id: number[];
}

export type EntryListFilter = OsEntryListFilter | DeviceEntryListFilter;