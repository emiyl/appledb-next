import React, { useEffect } from 'react';
import styles from '@/styles/OsEntryListFilter.module.scss';

import { faXmark, faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import OsEntryListSearchRow from './OsEntryListSearchRow';
import EntryListFilterItem from './EntryListFilterItem';
import { getOsEntryReleaseKindClass, getOsEntryReleaseKindLabel } from '@/utils';
import { OsEntryReleaseKind, OsEntryListFilter, OsEntryListSettings } from '@/types';

interface OsEntryListFilterProps {
    filter: OsEntryListFilter;
    setFilter: React.Dispatch<React.SetStateAction<OsEntryListFilter>>;
    settings: OsEntryListSettings;
    setSettings: React.Dispatch<React.SetStateAction<OsEntryListSettings>>;
    ref: React.RefObject<null>;
    isStuck: boolean;
}

const OsEntryListFilterRow: React.FC<OsEntryListFilterProps> = ({ filter, setFilter, settings, setSettings, ref, isStuck }) => {
    const [osNames, setOsNames] = React.useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        async function fetchOsNames() {
            try {
                const response = await fetch('/api/os-names');
                if (!response.ok) {
                    throw new Error('Failed to fetch OS names');
                }
                const data = await response.json();
                setOsNames(data);
            } catch (error) {
                console.error('Error fetching OS names:', error);
            }
        }

        fetchOsNames();
    }, []);

    const [collapseFirmwareNames, setCollapseFirmwareNames] = React.useState(true);
    const [collapseFirmwareNamesThreshold] = React.useState(5);
    const firmwareNames = osNames.filter(({ id }) => filter.name_id.includes(id));

    return (
        <div
            ref={ref}
            className={[styles.filterContainer, isStuck ? styles.stuck : ''].join(' ')}
        >
            <OsEntryListSearchRow
                filter={filter}
                setFilter={setFilter}
                settings={settings}
                setSettings={setSettings}
                osNames={osNames}
            />
            <div className={styles.filterRow}>
                {
                    Object.values(OsEntryReleaseKind)
                    .filter(kind => filter.releaseKinds[kind])
                    .map((kind) => (
                        <EntryListFilterItem
                            key={kind}
                            label={getOsEntryReleaseKindLabel(kind)}
                            icon={faXmark}
                            classes={[getOsEntryReleaseKindClass(kind)]}
                            onClick={() => setFilter(prev => ({
                                ...prev,
                                releaseKinds: {
                                    ...prev.releaseKinds,
                                    [kind]: !prev.releaseKinds[kind]
                                }
                            }))}
                        />
                    ))
                }
                {
                    (firmwareNames.length >= collapseFirmwareNamesThreshold) &&
                    <EntryListFilterItem
                        label="Firmware names"
                        icon={collapseFirmwareNames ? faCaretDown : faCaretRight}
                        classes={[]}
                        onClick={() => {
                            setCollapseFirmwareNames(!collapseFirmwareNames);
                        }}
                    />
                }
                {
                    (!collapseFirmwareNames || firmwareNames.length < collapseFirmwareNamesThreshold) &&
                    firmwareNames
                        .map(({ id, name }) => (
                            <EntryListFilterItem
                                key={id}
                                label={name}
                                icon={faXmark}
                                classes={[]}
                                onClick={() => setFilter(prev => ({
                                    ...prev,
                                    name_id: prev.name_id.filter(existingId => existingId !== id)
                                }))}
                            />
                        ))
                }
            </div>
        </div>
    );
};

export default OsEntryListFilterRow;