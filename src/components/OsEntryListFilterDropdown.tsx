import React from 'react';
import styles from '@/styles/OsEntryListFilterDropdown.module.scss';
import { OsEntryReleaseKind } from '@/types/OsEntryReleaseKind';
import { OsEntryFilter } from '@/types';
import OsEntryListFilterItem from './OsEntryListFilterItem';
import { getOsEntryReleaseKindClass, getOsEntryReleaseKindLabel } from '@/utils';
import { faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons';

interface OsEntryListFilterDropdown {
    filter: OsEntryFilter;
    setFilter: React.Dispatch<React.SetStateAction<OsEntryFilter>>;
    osNames: { id: number; name: string }[];
}


const OsEntryListFilterDropdown: React.FC<OsEntryListFilterDropdown> = ({ filter, setFilter, osNames }) => {
    const [firmwareNamesTruncateCount, setFirmwareNamesTruncateCount] = React.useState(5);
    const [firmwareNamesIncrement, setFirmwareNamesIncrement] = React.useState(10);

    return (
        <div className={styles.dropdown}>
            <div className={styles.row}>
                <h3>Release types</h3>
            </div>
            <div className={styles.row}>
            {
                    Object.values(OsEntryReleaseKind)
                    .filter(kind => !filter.releaseKinds[kind])
                    .map((kind) => (
                        <OsEntryListFilterItem
                            key={kind}
                            label={getOsEntryReleaseKindLabel(kind)}
                            icon={faPlus}
                            classes={[getOsEntryReleaseKindClass(kind), styles.filterItem]}
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
            </div>
            <div className={styles.row}>
                <h3>Firmware names</h3>
            </div>
            <div className={styles.row}>
                {
                    osNames
                        .filter(({ id }) => !filter.name_id.includes(id))
                        .slice(0, firmwareNamesTruncateCount)
                        .map(({ id, name }) => (
                            <OsEntryListFilterItem
                                key={id}
                                label={name}
                                icon={faPlus}
                                classes={[styles.filterItem]}
                                onClick={() => setFilter(prev => ({
                                    ...prev,
                                    name_id: [...prev.name_id, id]
                                }))}
                            />
                        ))
                }
                {
                    firmwareNamesTruncateCount < osNames.filter(({ id }) => !filter.name_id.includes(id)).length && (
                        <OsEntryListFilterItem
                            label="Show more"
                            icon={faCaretDown}
                            classes={[styles.filterItem]}
                            onClick={() => {
                                setFirmwareNamesTruncateCount(prev => prev + firmwareNamesIncrement)
                                setFirmwareNamesIncrement(prev => prev + 5)
                            }}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default OsEntryListFilterDropdown;