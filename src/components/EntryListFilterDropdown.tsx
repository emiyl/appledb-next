import React from 'react';
import styles from '@/styles/OsEntryListFilterDropdown.module.scss';
import { EntryType, OsEntryListFilter, DeviceEntryListFilter } from '@/types';
import { faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons';

import EntryListFilterItem from './EntryListFilterItem';
import OsEntryListFilterDropdownReleaseKind from './OsEntryListFilterDropdownReleaseKind';

type EntryListFilterDropdownProps =
  | {
        entryType: EntryType.Device;
        filter: DeviceEntryListFilter;
        setFilter: React.Dispatch<React.SetStateAction<DeviceEntryListFilter>>;
        filterItems: { id: number; name: string }[];
    }
  | {
        entryType: EntryType.Os;
        filter: OsEntryListFilter;
        setFilter: React.Dispatch<React.SetStateAction<OsEntryListFilter>>;
        filterItems: { id: number; name: string }[];
    };

const rowStrings: Record<string, string> = {
    'name_id': 'Firmware name',
    'category_id': 'Device category',
};

const EntryListFilterDropdown: React.FC<EntryListFilterDropdownProps> = ({ entryType, filter, setFilter, filterItems }) => {
    const [filterItemsTruncateCount, setFilterItemsTruncateCount] = React.useState(5);
    const [filterItemsIncrement, setFilterItemsIncrement] = React.useState(10);
    
    const filterRows = Object.keys(filter)
        .filter((key) => !['search', 'releaseKinds'].includes(key));

    return (
        <div className={styles.dropdown}>
            {entryType === EntryType.Os && (
                <OsEntryListFilterDropdownReleaseKind
                    filter={filter}
                    setFilter={setFilter}
                />
            )}
            {filterRows.map((rowKey) => (
                <div className={styles.row} key={rowKey as string}>
                    <h3>{rowStrings[rowKey]}</h3>
                    {filterItems
                        .filter(({ id }) => !filter[rowKey].includes(id))
                        .slice(0, filterItemsTruncateCount)
                        .map(({ id, name }) => (
                            <EntryListFilterItem
                                key={id}
                                label={name}
                                icon={faPlus}
                                classes={[styles.filterItem]}
                                onClick={() => setFilter(prev => ({
                                    ...prev,
                                    [rowKey]: [...prev[rowKey], id]
                                }))}
                            />
                        ))
                    }
                    {filterItemsTruncateCount < filterItems.filter(({ id }) => !filter[rowKey].includes(id)).length && (
                        <EntryListFilterItem
                            label="Show more"
                            icon={faCaretDown}
                            classes={[styles.filterItem]}
                            onClick={() => {
                                setFilterItemsTruncateCount(prev => prev + filterItemsIncrement)
                                setFilterItemsIncrement(prev => prev + 5)
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default EntryListFilterDropdown;