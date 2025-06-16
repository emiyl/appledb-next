import { OsEntryListFilter } from '@/types';
import { OsEntryReleaseKind } from '@/types/OsEntryReleaseKind';

export const defaultOsEntryListFilter: OsEntryListFilter = {
    releaseKinds: {
        [OsEntryReleaseKind.Release]: true,
        [OsEntryReleaseKind.Beta]: true,
        [OsEntryReleaseKind.Internal]: false,
        [OsEntryReleaseKind.SDK]: false,
        [OsEntryReleaseKind.Simulator]: false
    },
	search: '',
	name_id: []
};