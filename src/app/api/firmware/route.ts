import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

let queryCache = new Map<string, { data: any[]; timestamp: number }>();
const MAX_CACHE_SIZE = 1000;
const CACHE_LIFETIME_MS = 1 * 60 * 60 * 1000;

function manageCacheSize() {
    const now = Date.now();

    // Remove expired entries
    for (const [key, value] of queryCache.entries()) {
        if (value.timestamp && now - value.timestamp > CACHE_LIFETIME_MS) {
            queryCache.delete(key);
        }
    }

    // Enforce maximum cache size
    if (queryCache.size > MAX_CACHE_SIZE) {
        const firstKey = queryCache.keys().next().value;
        if (firstKey) {
            queryCache.delete(firstKey);
        }
    }
}

function setCache(key: string, data: any[]) {
    queryCache.set(key, { data, timestamp: Date.now() });
}

function getCache(key: string) {
    const cached = queryCache.get(key);
    if (cached && Date.now() - cached.timestamp <= CACHE_LIFETIME_MS) {
        return cached.data;
    }
    queryCache.delete(key);
    return null;
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const cacheKey = JSON.stringify(Object.fromEntries(searchParams.entries()));

    const cachedData = getCache(cacheKey);
    if (cachedData) {
        return Response.json(cachedData);
    }
    manageCacheSize();

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const release = searchParams.get('release') === 'true';
    const beta = searchParams.get('beta') === 'true';
    const rc = searchParams.get('rc') === 'true';
    const internal = searchParams.get('internal') === 'true';
    const sdk = searchParams.get('sdk') === 'true';
    const simulator = searchParams.get('simulator') === 'true';

    const filtersEnabled = release || beta || rc || internal || sdk || simulator;

    const kindFilters = [];
    if (release) kindFilters.push({ is_release: true });
    if (beta) kindFilters.push({ is_beta: true });
    if (rc) kindFilters.push({ is_rc: true });
    if (internal) kindFilters.push({ is_internal: true });

    const firmwareIdFilter = searchParams.get('id')
        ?.split(';')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

    const firmwareIdCondition = firmwareIdFilter && firmwareIdFilter.length > 0
        ? {
            id: {
                in: firmwareIdFilter,
            },
        }
        : undefined;

    const nameIdFilter = searchParams.get('name_id')
        ?.split(';')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

    const nameIdCondition = nameIdFilter && nameIdFilter.length > 0
        ? {
            OsLookupName: {
                id: {
                    in: nameIdFilter,
                },
            },
        }
        : undefined;

    const deviceIdFilter = searchParams.get('device_id')
        ?.split(';')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

    const deviceIdCondition = deviceIdFilter && deviceIdFilter.length > 0
        ? {
            MapDeviceOs: {
                some: {
                    device_id: {
                        in: deviceIdFilter,
                    }
                }
            }
        }
        : undefined;

    const legacyUniqueKeyFilter = searchParams.get('legacy_key')
        ?.split(';')
        .map((key) => key.trim())
        .filter((key) => key.length > 0);
        
    const legacyUniqueKeyCondition = legacyUniqueKeyFilter && legacyUniqueKeyFilter.length > 0
        ? {
            legacy_unique_key: {
                in: legacyUniqueKeyFilter,
            },
        }
        : undefined;

    const includeSourceTypesExclusive = searchParams.get('include_source_types_exclusive')?.split(';').map(s => s.trim()).filter(s => s.length > 0) || [];
    const excludeSourceTypes = searchParams.get('exclude_source_types')?.split(';').map(s => s.trim()).filter(s => s.length > 0) || [];

    const rawSearch = searchParams.get("search");
    const searchString = rawSearch ? decodeURIComponent(rawSearch).trim() : undefined;

    const reverse = searchParams.get('reverse') === 'true';

    const entriesRaw = await prisma.osEntry.findMany({
        where: {
            AND: [
                ...(kindFilters.length > 0 ? [{ OR: kindFilters }] : []),
                ...(filtersEnabled && !sdk ? [{ is_sdk: false }] : []),
                ...(filtersEnabled && !simulator ? [{ is_simulator: false }] : []),
                ...(firmwareIdCondition ? [firmwareIdCondition] : []),
                ...(nameIdCondition ? [nameIdCondition] : []),
                ...(deviceIdCondition ? [deviceIdCondition] : []),
                ...(legacyUniqueKeyCondition ? [legacyUniqueKeyCondition] : []),
                {
                    search: {
                        contains: searchString,
                        mode: 'insensitive'
                    }
                }
            ],
        },
        orderBy:
            [
                {
                    release_datetime: {
                        sort: reverse ? 'asc' : 'desc',
                        nulls: 'last',
                    }
                },
                { OsLookupName: { name: reverse ? 'desc' : 'asc' } },
                { version: reverse ? 'desc' : 'asc' },
                { build: reverse ? 'desc' : 'asc' },
                { search: 'desc' },
            ],
        skip: offset,
        take: limit,
        include: {
            OsLookupName: {
                select: {
                    name: true,
                },
            },
            MapDeviceOs: {
                select: {
                    device_id: true,
                },
            },
            SourceEntry: deviceIdFilter && deviceIdFilter.length > 0
                ? {
                    where: {
                        ...(includeSourceTypesExclusive.length > 0
                            ? { source_type: { in: includeSourceTypesExclusive } }
                            : {}),
                        ...(excludeSourceTypes.length > 0
                            ? { source_type: { notIn: excludeSourceTypes } }
                            : {}),
                    },
                    select: {
                        id: true,
                        source_type: true,
                        SourceLink: {
                            select: {
                                url: true
                            }
                        },
                        SourceMapDevice: {
                            where: {
                                device_id: {
                                    in: deviceIdFilter
                                }
                            },
                            select: {
                                device_id: true,
                                source_id: true
                            }
                        }
                    }
                }
                : {
                    where: {
                        ...(includeSourceTypesExclusive.length > 0
                            ? { source_type: { in: includeSourceTypesExclusive } }
                            : {}),
                        ...(excludeSourceTypes.length > 0
                            ? { source_type: { notIn: excludeSourceTypes } }
                            : {}),
                    },
                    select: {
                        id: true,
                        source_type: true,
                        SourceLink: {
                            select: {
                                url: true
                            }
                        }
                    }
                }
        },
    });

    // If deviceIdFilter is active, filter SourceEntry to only those with a matching SourceMapDevice
    if (deviceIdFilter && deviceIdFilter.length > 0) {
        for (const entry of entriesRaw) {
            if (entry.SourceEntry) {
                entry.SourceEntry = entry.SourceEntry.filter((source: any) =>
                    source.SourceMapDevice &&
                    source.SourceMapDevice.some((map: any) =>
                        map.source_id === source.id && deviceIdFilter.includes(map.device_id)
                    )
                ).map((source: any) => {
                    // Remove SourceMapDevice from the response for cleanliness
                    const { SourceMapDevice, ...rest } = source;
                    return rest;
                });
            }
        }
    }

    // Map device_id to array
    const entries = entriesRaw.map(entry => ({
        ...entry,
        MapDeviceOs: undefined,
        DeviceMap: Array.isArray(entry.MapDeviceOs) ? entry.MapDeviceOs.map((d: any) => d.device_id) : [],
    }));

    if (!searchString) {
        setCache(cacheKey, entries);
    }

    return Response.json(entries);
}
