import React from 'react';
import styles from '@/styles/OsEntryListItem.module.scss';
import { OsEntry } from '@/types'
import { formatDateToString, getOsEntryReleaseKinds, obfuscateNumber } from '@/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import OsEntryReleaseKindFlag from './OsEntryReleaseKindFlag';
import Link from 'next/link';

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
        <Link href={`/firmware/${entry.OsLookupName.name.replace(/\s+/g, '-')}-${entry.version.replace(/\s+/g, '-')}.${obfuscateNumber(entry.id)}`} className={styles.row}>
            <div className={styles.name}>
                {entry.OsLookupName.name} {entry.version}
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
                <button
                    type="button"
                    className={styles.downloadLink}
                    title="Download"
                    onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        const url = eligibleSourceEntries[0].SourceLink[0]?.url;
                        if (url) {
                            window.location.href = url;
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faDownload} />
                </button>
            )}
            {eligibleSourceEntries.length > 1 && <FontAwesomeIcon icon={faFolderOpen} />}
            {entry.release_datetime && (
                <div className={styles.releaseDate}>
                    {formatDateToString(entry.release_datetime, entry.release_datetime_depth)}
                </div>
            )}
        </Link>
    );
};

export default OsEntryListItem;
