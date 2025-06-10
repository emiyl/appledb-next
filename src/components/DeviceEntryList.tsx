'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DeviceEntry } from '@/types'
import { defaultDeviceEntryFilter } from '@/utils';
import styles from '@/styles/DeviceEntryList.module.scss';
import DeviceEntryListRow from './DeviceEntryListRow';

export function DeviceEntryList() {
    const [entries, setEntries] = useState<DeviceEntry[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const hasMounted = useRef(false);

    const [filter, setFilter] = useState(() => defaultDeviceEntryFilter);

    const loadEntries = useCallback(async (append: boolean, page: number = 1) => {
        const url_base = `/api/device-entries?`;
        const url_params = new URLSearchParams({
            page: page.toString(),
            limit: '10'
        });
        const res = await fetch(url_base + url_params.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data: DeviceEntry[] = (await res.json()).map((entry: DeviceEntry) => {
            return {
                ...entry,
                image: entry.DeviceLookupImage ? entry.DeviceLookupImage.name : 'logo',
                // release_datetime: new Date(entry.release_datetime)
            };
        });

        if (append) {
            setEntries((prevEntries) => {
                const newEntries = data.filter(entry => 
                    !prevEntries.some(existingEntry => existingEntry.id === entry.id)
                );
                return [...prevEntries, ...newEntries]
            });
        } else {
            setEntries(data);
        }

        setHasMore(data.length > 0);
    }, [filter]);

    useEffect(() => {
        loadEntries(true, page);
    }, [page]);

    useEffect(() => {
        if (!loaderRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore]);

    return (
        <div className={styles.container}>
            {entries.map((entry) => (
                <DeviceEntryListRow
                    key={entry.id}
                    entry={entry}
                />
            ))}
            {hasMore && <div ref={loaderRef}></div>}
        </div>
    );
}