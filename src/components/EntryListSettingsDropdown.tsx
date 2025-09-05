import React from 'react';
import styles from '@/styles/EntryListSettingsDropdown.module.scss';
import { EntryType, EntryListSettings } from '@/types';

const rowStrings: Record<string, (value: boolean) => string> = {
    'reverseOrder': () => 'Reverse order',
    'showBuildString': (value: boolean) => value ? "Hide build strings" : "Show build strings",
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
        <div
            className={styles.dropdown}
            style={{
            // Calculate the longest possible label length in characters
            width: (() => {
                // Get all possible labels for each key in rowStrings
                const labels = Object.entries(rowStrings).flatMap(([key, fn]) => [
                fn(true),
                fn(false),
                ]);
                // Find the longest label
                const longest = labels.reduce((a, b) => (a.length > b.length ? a : b), '');
                // Estimate width in 'ch' units (character width)
                return `calc(${longest.length}ch)`; // 64px for checkbox, padding, etc.
            })(),
            }}
        >
            <h3>Settings</h3>
            {Object.entries(settings).map(([key, value]) => (
            <div
            className={styles.row}
            key={key}
            onClick={() => handleCheckboxChange(key as keyof typeof settings)}
            style={{ cursor: 'pointer' }}
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCheckboxChange(key as keyof typeof settings);
                }
            }}
            role="checkbox"
            aria-checked={!!value}
            >
            <span>{rowStrings[key] ? rowStrings[key](!!value) : key}</span>
            <input
            className={`${styles[key]} ${value ? styles.active : ''}`}
            type="checkbox"
            checked={!!value}
            onChange={e => e.stopPropagation()}
            tabIndex={-1}
            readOnly
            />
            </div>
            ))}
        </div>
    );
};

export default EntryListSettingsDropdown;