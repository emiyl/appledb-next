'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Entry, EntryType, OsEntry, DeviceEntry, EntryListFilter } from '@/types'
import styles from '@/styles/EntryList.module.scss';
import EntryListFilterRow from './EntryListFilterRow';

import { defaultOsEntryListFilter, defaultOsEntryListSettings } from '@/utils';
import OsEntryListItem from './OsEntryListItem';

import { defaultDeviceEntryListFilter, defaultDeviceEntryListSettings } from '@/utils';
import DeviceEntryListItem from './DeviceEntryListItem';
import { useSearchParams } from 'next/navigation';
import { deobfuscateNumber } from '@/utils/obfuscate';

type EntryTypeConfig<F, S, R, FR, D> = {
    filter: F,
    settings: S,
    row: R,
    style: string,
    apiEndpoint: string,
    getApiParams: (filter: F, settings: S, page: number) => Record<string, string>,
    processApiData?: (data: D[]) => D[]
};

function handleIdCsv(ids: string) {
    if (!ids) return [];
    return ids.split(',').map((id: string) => deobfuscateNumber(Number(id.trim()))) || [];
}

const entryTypeConfig: Record<EntryType, EntryTypeConfig<any, any, any, any, any>> = {
    [EntryType.Os]: {
        filter: (searchParams: any) => {
            return {
                ...defaultOsEntryListFilter,
                search: searchParams.get('search') || '',
                filter_id: handleIdCsv(searchParams.get('os') || '')
            };
        },
        settings: defaultOsEntryListSettings,
        row: OsEntryListItem,
        style: styles.os,
        apiEndpoint: 'os-entries',
        getApiParams: (filter, settings, page) => ({
            release: filter.releaseKinds.release.toString(),
            beta: filter.releaseKinds.beta.toString(),
            internal: filter.releaseKinds.internal.toString(),
            sdk: filter.releaseKinds.sdk.toString(),
            simulator: filter.releaseKinds.simulator.toString(),
            search: filter.search,
            name_id: filter.filter_id.join(','),
            reverse: settings.reverseOrder ? 'true' : 'false',
            page: page.toString(),
            limit: '100'
        }),
        processApiData: (data: OsEntry[]) => {
            return data.map(entry => ({
                ...entry,
                release_datetime: new Date(entry.release_datetime)
            }));
        },
    },
    [EntryType.Device]: {
        filter: (searchParams: any) => {
            return {
                ...defaultDeviceEntryListFilter,
                search: searchParams.get('search') || '',
                filter_id: handleIdCsv(searchParams.get('category') || '')
            };
        },
        settings: defaultDeviceEntryListSettings,
        row: DeviceEntryListItem,
        style: styles.device,
        apiEndpoint: 'device',
        getApiParams: (filter, settings, page) => ({
            search: filter.search,
            category_id: filter.filter_id.join(','),
            reverse: settings.reverseOrder ? 'true' : 'false',
            page: page.toString(),
            limit: '100'
        }),
        processApiData: (data: DeviceEntry[]) => data,
    }
};

export function EntryList({ entryType }: { entryType: EntryType }) {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const hasMounted = useRef(false);
    const areParamsChanging = useRef(false);

    const searchParams = useSearchParams();
    const getFilter = entryTypeConfig[entryType].filter(searchParams);

    const [filter, setFilter] = useState(() => getFilter);
    const [settings, setSettings] = useState(() => entryTypeConfig[entryType].settings);

    const loadEntries = useCallback(async (append: boolean, page: number = 1) => {
        const url_base = `/api/${entryTypeConfig[entryType].apiEndpoint}?`;
        const url_params = new URLSearchParams(
            entryTypeConfig[entryType].getApiParams(filter, settings, page)
        );
        const res = await fetch(url_base + url_params.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const rawData = await res.json();
        const data: Entry[] = entryTypeConfig[entryType].processApiData
            ? entryTypeConfig[entryType].processApiData(rawData)
            : rawData;

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
    }, [filter, settings, entryType]);

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
            <EntryListFilterRow
                entryType={entryType}
                filter={filter}
                setFilter={setFilter}
                settings={settings}
                setSettings={setSettings}
                ref={stickyRef}
                isStuck={isStuck}
            />
            <div className={entryTypeConfig[entryType].style}>
                {entries.map((entry) => {
                    const RowComponent = entryTypeConfig[entryType].row;
                    return (
                        <RowComponent
                            key={entry.id}
                            entry={entry}
                            showBuildString={settings.showBuildString}
                        />
                    );
                })}
            </div>
            {hasMore && <div ref={loaderRef}></div>}
        </div>
    );
}
