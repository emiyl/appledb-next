import { DeviceEntryListFilter } from '@/types';

export const defaultDeviceEntryListFilter: DeviceEntryListFilter = {
	search: '',
	filters: {
		'category': {
			label: 'Device category',
			contents: [],
			active: [],
			hidden: false,
			param: 'category',
			apiRoute: '/api/device-categories'
		}
	},
	filter_id: []
};