import React from 'react';
import styles from '@/styles/OsEntryReleaseKind.module.scss'

interface OsEntryReleaseKindFlagProps {
    osEntryReleaseKind: string;
}

const OsEntryReleaseKindFlag: React.FC<OsEntryReleaseKindFlagProps> = ({ osEntryReleaseKind }) => {
    return (
        <div
            className={`${styles.releaseKind} ${styles[osEntryReleaseKind] || ''}`}
        >
            {osEntryReleaseKind}
        </div>
    );
};

export default OsEntryReleaseKindFlag;
