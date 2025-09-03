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
    filters: {
        'os_name': {
            label: "Firmware name",
            contents: [],
			active: [],
            hidden: false,
            param: 'os_name',
            apiRoute: '/api/os-names'
        },
        'device': {
            label: "Device",
            contents: [],
			active: [],
            param: 'device',
            hidden: true
        }
    },
	filter_id: [],
	device_id: []
};