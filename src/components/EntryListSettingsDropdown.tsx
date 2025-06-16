import React from 'react';
import styles from '@/styles/OsEntryListSettingsDropdown.module.scss';
import { EntryType, DeviceEntryListSettings, OsEntryListSettings } from '@/types';

const settingsType = {
    [EntryType.Device]: 'DeviceEntryListSettings',
    [EntryType.Os]: 'OsEntryListSettings',
}

type EntryListSettingsDropdownProps =
  | {
      entryType: EntryType.Device;
      settings: DeviceEntryListSettings;
      setSettings: React.Dispatch<React.SetStateAction<DeviceEntryListSettings>>;
    }
  | {
      entryType: EntryType.Os;
      settings: OsEntryListSettings;
      setSettings: React.Dispatch<React.SetStateAction<OsEntryListSettings>>;
    };

const EntryListSettingsDropdown: React.FC<EntryListSettingsDropdownProps> = ({ settings, setSettings }) => {
    const handleCheckboxChange = (key: keyof typeof settings) => {
        setSettings((prevSettings: any) => ({
            ...prevSettings,
            [key]: !prevSettings[key],
        }));
    };

    return (
        <div className={styles.dropdown}>
            <h3>Settings</h3>
            {Object.entries(settings).map(([key, value]) => (
                <div className={styles.row} key={key}>
                    <span>{key}</span>
                    <input
                    type="checkbox"
                    checked={!!value}
                    onChange={() => handleCheckboxChange(key as keyof typeof settings)}
                    />
                </div>
            ))}
        </div>
    );
};

export default EntryListSettingsDropdown;