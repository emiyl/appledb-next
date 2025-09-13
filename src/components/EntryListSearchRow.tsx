import React, { useRef, useState, useEffect } from 'react';
import styles from '@/styles/EntryListFilter.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faCog } from '@fortawesome/free-solid-svg-icons';
import EntryListFilterDropdown from './EntryListFilterDropdown';
import EntryListSettingsDropdown from './EntryListSettingsDropdown';
import { EntryType, EntryListFilter, EntryListSettings, EntryListFilterItem } from '@/types';

type SearchRowProps = {
    entryType: EntryType;
    filter: EntryListFilter;
    setFilter: React.Dispatch<React.SetStateAction<EntryListFilter>>;
    settings: EntryListSettings;
    setSettings: React.Dispatch<React.SetStateAction<EntryListSettings>>;
    filterItems: EntryListFilterItem;
};

const SearchRow: React.FC<SearchRowProps> = ({ entryType, filter, setFilter, settings, setSettings, filterItems }) => {
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

    function dropdownStyle(showDropdown: boolean): React.CSSProperties {
        return {
            transition: 'opacity 0.2s ease-in-out',
            opacity: showDropdown ? 1 : 0,
            visibility: showDropdown ? 'visible' : 'hidden',
            pointerEvents: showDropdown ? 'auto' : 'none',
        };
    }

    return (
        <div className={styles.searchRow}>
            {(Object.values(filterItems).some(item => !item.hidden) || entryType == EntryType.Os) && (
                <div ref={dropdownRef}>
                    <div
                        className={`${styles.filterItem} ${styles.add} ${styles.filterSelected} ${styles.toggleDropdown}`}
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                        <div className={styles.filterIcon}><FontAwesomeIcon icon={faPlus} /></div>
                    </div>

                    <div style={dropdownStyle(showFilterDropdown)}>
                        <EntryListFilterDropdown
                            entryType={entryType}
                            filterObject={filter}
                            setFilterObject={setFilter}
                            filterItems={filterItems}
                        />
                    </div>
                </div>
            )}
            <div className={styles.searchContainer}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input
                    type="text"
                    placeholder="Search..."
                    className={styles.searchBar}
                    onChange={(e) => setFilter((prev) => ({
                        ...prev,
                        search: e.target.value
                    }))}
                />
            </div>
            <div ref={settingsRef}>
                <div
                    className={`${styles.filterItem} ${styles.settingsIcon}`}
                    onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                >
                    <div className={styles.filterIcon}><FontAwesomeIcon icon={faCog} /></div>
                </div>

                <div style={dropdownStyle(showSettingsDropdown)}>
                    <EntryListSettingsDropdown
                        entryType={entryType}
                        settings={settings}
                        setSettings={setSettings}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchRow;
