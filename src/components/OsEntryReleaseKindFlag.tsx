import OsEntryReleaseKindStyles from '@/styles/OsEntryReleaseKind.module.scss'

const OsEntryReleaseKindFlag: React.FC<{ osEntryReleaseKind: string }> = ({ osEntryReleaseKind }) => {
    return (
        <div
            className={`${OsEntryReleaseKindStyles.releaseKind} ${OsEntryReleaseKindStyles[osEntryReleaseKind] || ''}`}
        >
            {osEntryReleaseKind}
        </div>
    );
};

export default OsEntryReleaseKindFlag;