import React from 'react';
import styles from '@/styles/OsEntryListRow.module.scss';
import OsEntryReleaseKindStyles from '@/styles/OsEntryReleaseKind.module.scss'
import { OsEntry } from '@/types'
import { formatDateToString, getOsEntryReleaseKinds } from '@/utils';

const OsEntryReleaseKindFlag: React.FC<{ osEntryReleaseKind: string }> = ({ osEntryReleaseKind }) => {
    return (
        <div
            className={`${OsEntryReleaseKindStyles.releaseKind} ${OsEntryReleaseKindStyles[osEntryReleaseKind] || ''}`}
        >
            {osEntryReleaseKind}
        </div>
    );
};

const OsEntryListItem: React.FC<{
    entry: OsEntry;
    showBuildString: boolean;
}> = ({ entry, showBuildString }) => {
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

export default OsEntryListItem;
