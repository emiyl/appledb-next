import React, { useEffect } from 'react';
import styles from '@/styles/EntryListFilter.module.scss';

import { faXmark, faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import EntryListSearchRow from './EntryListSearchRow';
import EntryListFilterItem from './EntryListFilterItem';
import { EntryListFilter, EntryListSettings, EntryType, OsEntryListFilter, OsEntryReleaseKind } from '@/types';
import { obfuscateNumber } from '@/utils/obfuscate';
import { getOsEntryReleaseKindClass, getOsEntryReleaseKindLabel } from '@/utils';

interface EntryListFilterProps {
    entryType: EntryType;
    filter: EntryListFilter;
    setFilter: React.Dispatch<React.SetStateAction<EntryListFilter>>;
    settings: EntryListSettings;
    setSettings: React.Dispatch<React.SetStateAction<EntryListSettings>>;
    ref: React.RefObject<null>;
    isStuck: boolean;
}

const EntryListFilterRow: React.FC<EntryListFilterProps> = ({ entryType, filter, setFilter, settings, setSettings, ref, isStuck }) => {
    const filterItems = filter.filters || {};

    useEffect(() => {
        async function fetchMultipleNames() {
            for (const [key, { apiRoute, hidden, label }] of Object.entries(filterItems)) {
                if (!apiRoute || hidden) continue;

                try {
                    const response = await fetch(apiRoute);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${label}`);
                    }
                    const data = await response.json();
                    
                    const tempFilter = filter;
                    if (tempFilter.filters && tempFilter.filters[key]) {
                        tempFilter.filters[key].contents = data;
                        setFilter(tempFilter);
                    }
                } catch (error) {
                    console.error(`Error fetching ${label}:`, error);
                }
            }
        }

        fetchMultipleNames();
    }, []);

    const [collapseNames, setCollapseNames] = React.useState(true);
    const [collapseNamesThreshold] = React.useState(5);
    const currentActiveFilterItems = Object.values(filterItems).filter(item => !item.hidden).flatMap(item => item.active);
    let currentItemDrawn = 0;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        for (const [key, item] of Object.entries(filterItems)) {
            if (item.active.length > 0 && !item.hidden) {
                params.set(item.webParam || key, item.active.map(({ id }) => obfuscateNumber(id)).join(';'));
            }
            else {
                params.delete(item.webParam || key);
            }
        }

        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
        
    }, [filter]);

    return (
        <div
            ref={ref}
            className={[styles.filterContainer, isStuck ? styles.stuck : ''].join(' ')}
        >
            <EntryListSearchRow
                entryType={entryType}
                filter={filter}
                setFilter={setFilter as React.Dispatch<React.SetStateAction<EntryListFilter>>}
                settings={settings}
                setSettings={setSettings}
                filterItems={filterItems}
            />
            <div className={styles.filterRow}>
                {
                    entryType === EntryType.Os &&
                    Object.values(OsEntryReleaseKind)
                        .filter(kind => (filter as OsEntryListFilter).releaseKinds[kind])
                        .map((kind) => {
                            if (collapseNames && currentItemDrawn >= collapseNamesThreshold) return null;
                            currentItemDrawn++;
                            return (
                                <EntryListFilterItem
                                    key={kind}
                                    label={getOsEntryReleaseKindLabel(kind)}
                                    icon={faXmark}
                                    classes={[getOsEntryReleaseKindClass(kind)]}
                                    onClick={() => setFilter(prev => ({
                                        ...prev,
                                        releaseKinds: {
                                            ...(prev as OsEntryListFilter).releaseKinds,
                                            [kind]: !(prev as OsEntryListFilter).releaseKinds[kind]
                                        }
                                    }))}
                                />
                            )
                        })
                }
                {Object.entries(filterItems).filter(([_, item]) => !item.hidden).map(([key, item]) => (
                    item.active.map(({ id, name }) => {
                        if (collapseNames && currentItemDrawn >= collapseNamesThreshold) return null;
                        currentItemDrawn++;
                        return (
                            <EntryListFilterItem
                                key={id}
                                label={name}
                                icon={faXmark}
                                classes={[]}
                                onClick={() => setFilter(prev => {
                                    const newFilters = { ...prev.filters };
                                    const active = newFilters[key].active || [];
                                    newFilters[key] = {
                                        ...newFilters[key],
                                        active: active.filter(entry => entry.id !== id)
                                    };
                                    return { ...prev, filters: newFilters };
                                })}
                            />
                        )
                    })
                ))}
                {
                    (currentActiveFilterItems.length >= collapseNamesThreshold) &&
                    <EntryListFilterItem
                        label={collapseNames ? "Expand" : "Collapse"}
                        icon={collapseNames ? faCaretDown : faCaretRight}
                        classes={[]}
                        onClick={() => {
                            setCollapseNames(!collapseNames);
                        }}
                    />
                }
            </div>
        </div>
    );
};

export default EntryListFilterRow;