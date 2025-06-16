import { OsEntryReleaseKind } from './OsEntryReleaseKind';

export type OsEntryListFilter = {
    releaseKinds: {
        [key in OsEntryReleaseKind]: boolean;
    },
    search: string;
    name_id: number[];
}