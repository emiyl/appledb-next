import { OsEntryReleaseKind } from './OsEntryReleaseKind';

export type OsEntryFilter = {
    releaseKinds: {
        [key in OsEntryReleaseKind]: boolean;
    },
    search: string;
    name_id: number[];
}