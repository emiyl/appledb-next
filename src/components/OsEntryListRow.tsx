import React from 'react';
import OsEntryReleaseKindFlag from './OsEntryReleaseKindFlag';
import styles from '@/styles/OsEntryListRow.module.scss';
import { OsEntry } from '@/types'
import { formatDateToString, getOsEntryReleaseKinds } from '@/utils';

interface OsEntryListRowProps {
    entry: OsEntry;
    showBuildString: boolean;
}

const OsEntryListRow: React.FC<OsEntryListRowProps> = ({ entry, showBuildString }) => {
    const osEntryReleaseKinds = getOsEntryReleaseKinds(entry);

    return (
        <div className={styles.row}>
            <div className={styles.name}>
                {`${entry.OsLookupName.name} ${entry.version}`}
            </div>
            {showBuildString && entry.build && (
                <code className={styles.build}>
                    {entry.build}
                </code>
            )}
            {osEntryReleaseKinds.map((kind, index) => (
                <OsEntryReleaseKindFlag
                    key={index}
                    osEntryReleaseKind={kind}
                />
            ))}
            <div className={styles.separator} />
            {entry.release_datetime && (
                <div className={styles.releaseDate}>
                    {formatDateToString(entry.release_datetime, entry.release_datetime_depth)}
                </div>
            )}
        </div>
    );
};

export default OsEntryListRow;
