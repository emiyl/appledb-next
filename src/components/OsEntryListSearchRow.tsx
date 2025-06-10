import React, { useRef, useState, useEffect } from 'react';
import styles from '@/styles/OsEntryListFilter.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faCog } from '@fortawesome/free-solid-svg-icons';
import OsEntryListFilterDropdown from './OsEntryListFilterDropdown';
import OsEntryListSettingsDropdown from './OsEntryListSettingsDropdown';
import { OsEntryFilter } from '@/types/OsEntryFilter';
import { OsEntryListSettings } from '@/types/OsEntryListSettings';

interface SearchRowProps {
    filter: OsEntryFilter;
    setFilter: React.Dispatch<React.SetStateAction<OsEntryFilter>>;
    settings: OsEntryListSettings;
    setSettings: React.Dispatch<React.SetStateAction<OsEntryListSettings>>;
    osNames: { id: number; name: string }[];
}

const SearchRow: React.FC<SearchRowProps> = ({ filter, setFilter, settings, setSettings, osNames }) => {
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
                    <OsEntryListFilterDropdown
                        filter={filter}
                        setFilter={setFilter}
                        osNames={osNames}
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
                    <OsEntryListSettingsDropdown
                        settings={settings}
                        setSettings={setSettings}
                    />
                )}
            </div>
        </div>
    );
};

export default SearchRow;
