'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DeviceEntry, DeviceEntryListFilter, DeviceEntryListSettings } from '@/types'
import { defaultDeviceEntryListFilter, defaultDeviceEntryListSettings } from '@/utils';
import styles from '@/styles/DeviceEntryList.module.scss';
import DeviceEntryListRow from './DeviceEntryListRow';
import DeviceEntryListFilterRow from './DeviceEntryListFilterRow';

export function DeviceEntryList() {
    const [entries, setEntries] = useState<DeviceEntry[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const hasMounted = useRef(false);
    const areParamsChanging = useRef(false);

    const [filter, setFilter] = useState(() => defaultDeviceEntryListFilter);
    const [settings, setSettings] = useState(() => defaultDeviceEntryListSettings);

    const loadEntries = useCallback(async (append: boolean, page: number = 1) => {
        const url_base = `/api/device-entries?`;
        const url_params = new URLSearchParams({
            search: filter.search,
            category_id: filter.category_id.join(','),
            reverse: settings.reverseOrder ? 'true' : 'false',
            page: page.toString(),
            limit: '100'
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
    }, [filter, settings]);

    useEffect(() => {
        if (areParamsChanging.current) {
            areParamsChanging.current = false;
        } else {
            loadEntries(true, page);
        }
    }, [page]);

    useEffect(() => {
        if (hasMounted.current) {
            areParamsChanging.current = true;
            setPage(1);
            areParamsChanging.current = false;
            loadEntries(false, 1);
        } else {
            hasMounted.current = true;
        }
    }, [filter, settings]);

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

    const sentinelRef = useRef(null);
    const stickyRef = useRef(null);
    const [isStuck, setIsStuck] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsStuck(entry.boundingClientRect.y < 0);
            },
            { threshold: [1] }
        );

        const sentinel = sentinelRef.current;
        if (sentinel) observer.observe(sentinel);

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, []);

    return (
        <div style={{ overflow: 'visible' }}>
            <div ref={sentinelRef} style={{ height: 1 }}></div>
            <DeviceEntryListFilterRow
                filter={filter} setFilter={setFilter}
                settings={settings} setSettings={setSettings}
                ref={stickyRef}
                isStuck={isStuck}
            />
            <div className={styles.container}>
                {entries.map((entry) => (
                    <DeviceEntryListRow
                    key={entry.id}
                    entry={entry}
                    />
                ))}
                {hasMore && <div ref={loaderRef}></div>}
            </div>
        </div>
    );
}