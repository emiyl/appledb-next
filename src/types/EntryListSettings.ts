export interface OsEntryListSettings {
    reverseOrder: boolean;
    showBuildString: boolean;
}

export interface DeviceEntryListSettings {
    reverseOrder: boolean;
}

export type EntryListSettings = OsEntryListSettings | DeviceEntryListSettings;