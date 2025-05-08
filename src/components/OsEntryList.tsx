'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { OsEntry } from '@/types'
import { defaultOsEntryFilter } from '@/utils/osEntryFilter';
import { defaultOsEntryListSettings } from '@/utils/osEntryListSettings';
import OsEntryListRow from './OsEntryListRow';
import OsEntryListFilter from './OsEntryListFilter';

export function OsEntryList() {
    const [entries, setEntries] = useState<OsEntry[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const hasMounted = useRef(false);
    const isFilterChanging = useRef(false);

    const [filter, setFilter] = useState(() => defaultOsEntryFilter);
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
    }, [filter]);

    useEffect(() => {
        if (isFilterChanging.current) {
            isFilterChanging.current = false;
        } else {
            loadEntries(true, page);
        }
    }, [page]);

    useEffect(() => {
        if (hasMounted.current) {
            isFilterChanging.current = true;
            setPage(1);
            isFilterChanging.current = false;
            loadEntries(false, 1);
        } else {
            hasMounted.current = true;
        }
    }, [filter]);

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
        <div>
            <OsEntryListFilter
                filter={filter} setFilter={setFilter}
                settings={settings} setSettings={setSettings}
            />
            {entries.map((entry) => (
                <OsEntryListRow
                    key={entry.id}
                    entry={entry}
                    showBuildString={settings.showBuildString}
                />
            ))}
            {hasMore && <div ref={loaderRef}></div>}
        </div>
    );
}
