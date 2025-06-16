import React, { useRef, useState, useEffect } from 'react';
import styles from '@/styles/OsEntryListFilter.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faCog } from '@fortawesome/free-solid-svg-icons';
import EntryListFilterDropdown from './EntryListFilterDropdown';
import EntryListSettingsDropdown from './EntryListSettingsDropdown';
import { EntryType, DeviceEntryListFilter, DeviceEntryListSettings } from '@/types';

interface SearchRowProps {
    filter: DeviceEntryListFilter;
    setFilter: React.Dispatch<React.SetStateAction<DeviceEntryListFilter>>;
    settings: DeviceEntryListSettings;
    setSettings: React.Dispatch<React.SetStateAction<DeviceEntryListSettings>>;
    deviceCategories: { id: number; name: string }[];
}

const SearchRow: React.FC<SearchRowProps> = ({ filter, setFilter, settings, setSettings, deviceCategories }) => {
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowFilterDropdown(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettingsDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.searchRow}>
            <div ref={dropdownRef}>
                <div
                    className={`${styles.filterItem} ${styles.add} ${styles.filterSelected} ${styles.toggleDropdown}`}
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                    <div className={styles.filterIcon}><FontAwesomeIcon icon={faPlus} /></div>
                </div>

                {showFilterDropdown && (
                    <EntryListFilterDropdown
                        filter={filter}
                        setFilter={setFilter}
                        filterItems={deviceCategories}
                    />
                )}
            </div>
            <div className={styles.searchContainer}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input
                    type="text"
                    placeholder="Search..."
                    className={styles.searchBar}
                    onChange={(e) => setFilter(prev => ({
                        ...prev,
                        search: e.target.value
                    }))}
                />
            </div>
            <div ref={settingsRef}>
                <div
                    className={`${styles.filterItem} ${styles.add} ${styles.filterSelected} ${styles.toggleDropdown}`}
                    onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                >
                    <div className={styles.filterIcon}><FontAwesomeIcon icon={faCog} /></div>
                </div>

                {showSettingsDropdown && (
                    <EntryListSettingsDropdown
                        entryType={EntryType.Device}
                        settings={settings}
                        setSettings={setSettings}
                    />
                )}
            </div>
        </div>
    );
};

export default SearchRow;
