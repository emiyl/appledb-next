'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Entry, EntryType, OsEntry, DeviceEntry } from '@/types'
import deviceStyles from '@/styles/DeviceEntryList.module.scss';

import { defaultOsEntryListFilter, defaultOsEntryListSettings } from '@/utils';
import OsEntryListRow from './OsEntryListRow';
import OsEntryListFilterRow from './OsEntryListFilterRow';

import { defaultDeviceEntryListFilter, defaultDeviceEntryListSettings } from '@/utils';
import DeviceEntryListRow from './DeviceEntryListRow';
import DeviceEntryListFilterRow from './DeviceEntryListFilterRow';

type EntryTypeConfig<F, S, R, FR, D> = {
    filter: F,
    settings: S,
    row: R,
    filterRow: FR,
    styles?: Record<string, string>,
    apiEndpoint: string,
    getApiParams: (filter: F, settings: S, page: number) => Record<string, string>,
    processApiData?: (data: D[]) => D[]
};

const entryTypeConfig: Record<EntryType, EntryTypeConfig<any, any, any, any, any>> = {
    os: {
        filter: defaultOsEntryListFilter,
        settings: defaultOsEntryListSettings,
        row: OsEntryListRow,
        filterRow: OsEntryListFilterRow,
        styles: undefined,
        apiEndpoint: '/api/os-entries',
        getApiParams: (filter, settings, page) => ({
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
        }),
        processApiData: (data: OsEntry[]) => {
            return data.map(entry => ({
                ...entry,
                release_datetime: new Date(entry.release_datetime)
            }));
        },
    },
    device: {
        filter: defaultDeviceEntryListFilter,
        settings: defaultDeviceEntryListSettings,
        row: DeviceEntryListRow,
        filterRow: DeviceEntryListFilterRow,
        styles: deviceStyles,
        apiEndpoint: '/api/device',
        getApiParams: (filter, settings, page) => ({
            search: filter.search,
            category_id: filter.category_id.join(','),
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

    const [filter, setFilter] = useState(() => entryTypeConfig[entryType].filter);
    const [settings, setSettings] = useState(() => entryTypeConfig[entryType].settings);

    const loadEntries = useCallback(async (append: boolean, page: number = 1) => {
        const url_base = `${entryTypeConfig[entryType].apiEndpoint}?`;
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
            {React.createElement(
                entryTypeConfig[entryType].filterRow,
                {
                    filter,
                    setFilter,
                    settings,
                    setSettings,
                    ref: stickyRef,
                    isStuck
                }
            )}
            <div className={entryTypeConfig[entryType].styles?.container}>
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
