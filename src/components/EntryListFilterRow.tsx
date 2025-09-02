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

const entryTypeConfig = {
    [EntryType.Os]: {
        apiRoute: '/api/os-names',
        label: 'Firmware names',
        param: 'os'
    },
    [EntryType.Device]: {
        apiRoute: '/api/device-categories',
        label: 'Device categories',
        param: 'category'
    },
};

const EntryListFilterRow: React.FC<EntryListFilterProps> = ({ entryType, filter, setFilter, settings, setSettings, ref, isStuck }) => {
    const [names, setNames] = React.useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        async function fetchNames() {
            try {
                const response = await fetch(entryTypeConfig[entryType].apiRoute);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${entryTypeConfig[entryType].label}`);
                }
                const data = await response.json();
                setNames(data);
            } catch (error) {
                console.error(`Error fetching ${entryTypeConfig[entryType].label}:`, error);
            }
        }

        fetchNames();
    }, []);

    const [collapseNames, setCollapseNames] = React.useState(true);
    const [collapseNamesThreshold] = React.useState(5);

    const filteredNames = names.filter(({ id }) => filter.filter_id.includes(id));

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paramName = entryTypeConfig[entryType].param;

        if (filter.filter_id.length === 0) {
            params.delete(paramName);
            window.history.replaceState({}, '', `${window.location.pathname}`);
        } else {
            params.set(
                paramName,
                filter.filter_id.map(num => obfuscateNumber(num)).join(',')
            );
            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
        }

        
    }, [filter, entryType]);

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
                names={names}
            />
            <div className={styles.filterRow}>
                {
                    entryType === EntryType.Os &&
                    Object.values(OsEntryReleaseKind)
                        .filter(kind => (filter as OsEntryListFilter).releaseKinds[kind])
                        .map((kind) => (
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
                        ))
                }
                {
                    (filteredNames.length >= collapseNamesThreshold) &&
                    <EntryListFilterItem
                        label={entryTypeConfig[entryType].label}
                        icon={collapseNames ? faCaretDown : faCaretRight}
                        classes={[]}
                        onClick={() => {
                            setCollapseNames(!collapseNames);
                        }}
                    />
                }
                {
                    (!collapseNames || filteredNames.length < collapseNamesThreshold) &&
                    filteredNames
                        .map(({ id, name }) => (
                            <EntryListFilterItem
                                key={id}
                                label={name}
                                icon={faXmark}
                                classes={[]}
                                onClick={() => setFilter(prev => ({
                                    ...prev,
                                    filter_id: prev.filter_id.filter(existingId => existingId !== id)
                                }))}
                            />
                        ))
                }
            </div>
        </div>
    );
};

export default EntryListFilterRow;