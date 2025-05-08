import React from 'react';
import styles from '@/styles/OsEntryListFilter.module.scss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface OsEntryListFilterItemProps {
    label: string;
    icon: IconDefinition;
    classes: string[];
    onClick: () => void;
}

const OsEntryListFilterItem: React.FC<OsEntryListFilterItemProps> = ({ label, icon, classes, onClick }) => {
    return (
        <div
            className={`${styles.filterItem} ${styles.filterSelected} ${classes.join(' ')}`}
            onClick={onClick}
        >
            <span>{label}</span>
            <div className={styles.filterIcon}>
                <FontAwesomeIcon icon={icon} />
            </div>
        </div>
    );
};

export default OsEntryListFilterItem;