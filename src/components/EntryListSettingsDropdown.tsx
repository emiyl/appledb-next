import React from 'react';
import styles from '@/styles/OsEntryListSettingsDropdown.module.scss';
import { EntryType, EntryListSettings } from '@/types';

const rowStrings: Record<string, string> = {
    'reverseOrder': 'Reverse order',
    'showBuildString': 'Show build strings',
};

type EntryListSettingsDropdownProps = {
    entryType: EntryType;
    settings: EntryListSettings;
    setSettings: React.Dispatch<React.SetStateAction<EntryListSettings>>;
};

const EntryListSettingsDropdown: React.FC<EntryListSettingsDropdownProps> = ({ settings, setSettings }) => {
    const handleCheckboxChange = (key: keyof typeof settings) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [key]: !prevSettings[key],
        }));
    };

    return (
        <div className={styles.dropdown}>
            <h3>Settings</h3>
            {Object.entries(settings).map(([key, value]) => (
                <div className={styles.row} key={key}>
                    <span>{rowStrings[key]}</span>
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