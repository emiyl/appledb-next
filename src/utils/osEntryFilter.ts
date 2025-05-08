import { OsEntryReleaseKind } from '@/types/OsEntryReleaseKind';
import { OsEntryFilter } from '@/types/OsEntryFilter';

export const defaultOsEntryFilter: OsEntryFilter = {
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