import React from 'react';
import styles from '@/styles/OsEntry.module.scss';
import { OsEntry } from '@/types'
import { formatDateToString, getOsEntryReleaseKinds } from '@/utils';
import OsEntryReleaseKindFlag from './OsEntryReleaseKindFlag';

interface OsEntryProps {
    entry: OsEntry;
}

const OsEntryComponent: React.FC<OsEntryProps> = ({ entry }) => {
    const osEntryReleaseKinds = getOsEntryReleaseKinds(entry);
    
    return (
        <div>
            <h1 className={styles.title}>{entry.OsLookupName.name} {entry.version}</h1>
            <div className={styles.meta}>
                {entry.release_datetime && (
                    <span>
                        {formatDateToString(entry.release_datetime, entry.release_datetime_depth)}
                    </span>
                ) || <span>Unknown date</span>}

                {osEntryReleaseKinds.map((kind, index) => (
                    <OsEntryReleaseKindFlag
                        key={index}
                        osEntryReleaseKind={kind}
                    />
                ))}
            </div>

            <h2>JSON</h2>
            <pre>
                {JSON.stringify(entry, null, 2)}
            </pre>
        </div>
    );
};

export default OsEntryComponent;