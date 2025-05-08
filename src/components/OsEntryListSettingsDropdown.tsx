import React from 'react';
import styles from '@/styles/OsEntryListSettingsDropdown.module.scss';
import { OsEntryListSettings } from '@/types';

interface OsEntryListSettingsDropdown {
    settings: OsEntryListSettings;
    setSettings: React.Dispatch<React.SetStateAction<OsEntryListSettings>>;
}

const OsEntryListSettingsDropdown: React.FC<OsEntryListSettingsDropdown> = ({ settings, setSettings }) => {
    const handleCheckboxChange = (key: keyof OsEntryListSettings) => {
        setSettings((prevSettings) => ({
            ...prevSettings,
            [key]: !prevSettings[key],
        }));
    };

    return (
        <div className={styles.dropdown}>
            <h3>Settings</h3>
            <div className={styles.row}>
                <span>Show build string</span>
                <input
                    type="checkbox"
                    checked={settings.showBuildString}
                    onChange={() => handleCheckboxChange('showBuildString')}
                />
            </div>
            <div className={styles.row}>
                <span>Reverse order</span>
                <input
                    type="checkbox"
                    checked={settings.reverseOrder}
                    onChange={() => handleCheckboxChange('reverseOrder')}
                />
            </div>
        </div>
    );
};

export default OsEntryListSettingsDropdown;