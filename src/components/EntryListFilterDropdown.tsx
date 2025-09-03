import React from 'react';
import styles from '@/styles/EntryListFilterDropdown.module.scss';
import { EntryType, EntryListFilter, OsEntryListFilter, EntryListFilterItem } from '@/types';
import { faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons';

import EntryListFilterItemComponent from './EntryListFilterItem';
import OsEntryListFilterDropdownReleaseKind from './OsEntryListFilterDropdownReleaseKind';

type EntryListFilterDropdownProps = {
    entryType: EntryType;
    filterObject: EntryListFilter;
    setFilterObject: React.Dispatch<React.SetStateAction<EntryListFilter>>;
    filterItems: EntryListFilterItem;
};

const EntryListFilterDropdown: React.FC<EntryListFilterDropdownProps> = ({ entryType, filterObject, setFilterObject, filterItems }) => {
    const [filterItemsTruncateCount, setFilterItemsTruncateCount] = React.useState(5);
    const [filterItemsIncrement, setFilterItemsIncrement] = React.useState(10);
    
    return (
        <div className={styles.dropdown}>
            {entryType === EntryType.Os && (
                <OsEntryListFilterDropdownReleaseKind
                    filter={filterObject as OsEntryListFilter}
                    setFilter={setFilterObject as React.Dispatch<React.SetStateAction<OsEntryListFilter>>}
                />
            )}
            { Object.entries(filterItems ?? {})
            .filter(([_, filterValue]) => !filterValue.hidden)
            .map(([filterKey, filterValue]) => (
                <div className={styles.row} key={filterKey}>
                    <h3>{filterValue.label}</h3>
                    { filterValue.contents &&
                    filterValue.contents
                    .filter(item => !filterValue.active.some(activeItem => activeItem.id === item.id))
                    .slice(0, filterItemsTruncateCount)
                    .map(({ id, name }) => (
                        <EntryListFilterItemComponent
                            key={id}
                            label={name}
                            icon={faPlus}
                            classes={[styles.filterItem]}
                            onClick={() => setFilterObject((prevFilter: any) => {
                                const newFilters = { ...prevFilter.filters };
                                const active = newFilters[filterKey].active || [];
                                if (!active.includes(id)) {
                                    newFilters[filterKey] = {
                                        ...newFilters[filterKey],
                                        active: [...active, {id, name}]
                                    };
                                }
                                return { ...prevFilter, filters: newFilters };
                            })}
                        />
                    ))}
                    {filterValue.contents &&
                        filterItemsTruncateCount < filterValue.contents.length - filterValue.active.length && (
                        <EntryListFilterItemComponent
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