import React from 'react';
import styles from '@/styles/OsEntryListFilterDropdown.module.scss';
import { OsEntryReleaseKind, OsEntryListFilter } from '@/types';
import EntryListFilterItem from './EntryListFilterItem';
import { getOsEntryReleaseKindClass, getOsEntryReleaseKindLabel } from '@/utils';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface OsEntryListFilterDropdownReleaseKindProps {
    filter: OsEntryListFilter;
    setFilter: React.Dispatch<React.SetStateAction<OsEntryListFilter>>;
}

const OsEntryListFilterDropdownReleaseKind: React.FC<OsEntryListFilterDropdownReleaseKindProps> = ({ filter, setFilter }) => {
    return (
        <>
            <div className={styles.row}>
                <h3>Release types</h3>
            </div>
            <div className={styles.row}>
            {
                    Object.values(OsEntryReleaseKind)
                    .filter(kind => !filter.releaseKinds[kind])
                    .map((kind) => (
                        <EntryListFilterItem
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
        </>
    );
};

export default OsEntryListFilterDropdownReleaseKind;