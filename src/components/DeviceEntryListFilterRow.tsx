import React, { useEffect } from 'react';
import styles from '@/styles/OsEntryListFilter.module.scss';

import { faXmark, faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import DeviceEntryListSearchRow from './DeviceEntryListSearchRow';
import EntryListFilterItem from './EntryListFilterItem';
import { DeviceEntryListFilter, DeviceEntryListSettings } from '@/types';

interface DeviceEntryListFilterProps {
    filter: DeviceEntryListFilter;
    setFilter: React.Dispatch<React.SetStateAction<DeviceEntryListFilter>>;
    settings: DeviceEntryListSettings;
    setSettings: React.Dispatch<React.SetStateAction<DeviceEntryListSettings>>;
    ref: React.RefObject<null>;
    isStuck: boolean;
}

const DeviceEntryListFilterRow: React.FC<DeviceEntryListFilterProps> = ({ filter, setFilter, settings, setSettings, ref, isStuck }) => {
    const [deviceCategories, setDeviceCategories] = React.useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        async function fetchDeviceCategories() {
            try {
                const response = await fetch('/api/device-categories');
                if (!response.ok) {
                    throw new Error('Failed to fetch device categories');
                }
                const data = await response.json();
                setDeviceCategories(data);
            } catch (error) {
                console.error('Error fetching device categories:', error);
            }
        }

        fetchDeviceCategories();
    }, []);

    const [collapseDeviceCategoryNames, setCollapseDeviceCategoryNames] = React.useState(true);
    const [collapseDeviceCategoryNamesThreshold] = React.useState(5);

    const deviceCategoryNames = deviceCategories.filter(({ id }) => filter.category_id.includes(id));

    return (
        <div
            ref={ref}
            className={[styles.filterContainer, isStuck ? styles.stuck : ''].join(' ')}
        >
            <DeviceEntryListSearchRow
                filter={filter}
                setFilter={setFilter}
                settings={settings}
                setSettings={setSettings}
                deviceCategories={deviceCategories}
            />
            <div className={styles.filterRow}>
                {
                    (deviceCategoryNames.length >= collapseDeviceCategoryNamesThreshold) &&
                    <EntryListFilterItem
                        label="Device categories"
                        icon={collapseDeviceCategoryNames ? faCaretDown : faCaretRight}
                        classes={[]}
                        onClick={() => {
                            setCollapseDeviceCategoryNames(!collapseDeviceCategoryNames);
                        }}
                    />
                }
                {
                    (!collapseDeviceCategoryNames || deviceCategoryNames.length < collapseDeviceCategoryNamesThreshold) &&
                    deviceCategoryNames
                        .map(({ id, name }) => (
                            <EntryListFilterItem
                                key={id}
                                label={name}
                                icon={faXmark}
                                classes={[]}
                                onClick={() => setFilter(prev => ({
                                    ...prev,
                                    category_id: prev.category_id.filter(existingId => existingId !== id)
                                }))}
                            />
                        ))
                }
            </div>
        </div>
    );
};

export default DeviceEntryListFilterRow;