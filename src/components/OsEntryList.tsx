'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { OsEntry, OsEntryListFilter, OsEntryListSettings } from '@/types'
import { defaultOsEntryListFilter, defaultOsEntryListSettings } from '@/utils';
import OsEntryListRow from './OsEntryListRow';
import OsEntryListFilterRow from './OsEntryListFilterRow';

export function OsEntryList() {
    const [entries, setEntries] = useState<OsEntry[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const hasMounted = useRef(false);
    const areParamsChanging = useRef(false);

    const [filter, setFilter] = useState(() => defaultOsEntryListFilter);
    const [settings, setSettings] = useState(() => defaultOsEntryListSettings);

    const loadEntries = useCallback(async (append: boolean, page: number = 1) => {
        const url_base = `/api/os-entries?`;
        const url_params = new URLSearchParams({
            release: filter.releaseKinds.release.toString(),
            beta: filter.releaseKinds.beta.toString(),
            internal: filter.releaseKinds.internal.toString(),
            sdk: filter.releaseKinds.sdk.toString(),
            simulator: filter.releaseKinds.simulator.toString(),
            search: filter.search,
            name_id: filter.name_id.join(','),
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
        const data: OsEntry[] = (await res.json()).map((entry: OsEntry) => {
            return {
                ...entry,
                release_datetime: new Date(entry.release_datetime)
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
            <OsEntryListFilterRow
                filter={filter} setFilter={setFilter}
                settings={settings} setSettings={setSettings}
                ref={stickyRef}
                isStuck={isStuck}
            />
            <div>
                {entries.map((entry) => (
                    <OsEntryListRow
                        key={entry.id}
                        entry={entry}
                        showBuildString={settings.showBuildString}
                    />
                ))}
            </div>
            {hasMore && <div ref={loaderRef}></div>}
        </div>
    );
}
