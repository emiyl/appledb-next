import React from 'react';
import styles from '@/styles/OsEntryListItem.module.scss';
import OsEntryReleaseKindStyles from '@/styles/OsEntryReleaseKind.module.scss'
import { OsEntry, OsEntryReleaseKind } from '@/types'
import { formatDateToString, getOsEntryReleaseKinds } from '@/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

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
    const sourceEntries = entry.SourceEntry || [];

    const eligibleSourceEntries = sourceEntries.filter(se => {
        if (entry.OsLookupName.name === 'macOS') {
            if (se.source_type === 'installassistant') {
                return true;
            } else {
                return false;
            }
        }
        
        return true;
    });


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
            {eligibleSourceEntries.length === 1 && (
                <a
                    href={eligibleSourceEntries[0].SourceLink[0]?.url}
                    className={styles.downloadLink}
                    rel="noopener noreferrer"
                    title="Download"
                >
                    <FontAwesomeIcon icon={faDownload} />
                </a>
            )}
            {eligibleSourceEntries.length > 1 && <FontAwesomeIcon icon={faFolderOpen} />}
            {entry.release_datetime && (
                <div className={styles.releaseDate}>
                    {formatDateToString(entry.release_datetime, entry.release_datetime_depth)}
                </div>
            )}
        </div>
    );
};

export default OsEntryListItem;
