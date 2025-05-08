import { OsEntry } from '@/types';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

let queryCache = new Map<string, { data: any[]; timestamp: number }>();
const MAX_CACHE_SIZE = 100;
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
    const internal = searchParams.get('internal') === 'true';
    const sdk = searchParams.get('sdk') === 'true';
    const simulator = searchParams.get('simulator') === 'true';

    const filtersEnabled = release || beta || internal || sdk || simulator;

    const kindFilters = [];
    if (release) kindFilters.push({ is_release: true });
    if (beta) kindFilters.push({ is_beta: true });
    if (internal) kindFilters.push({ is_internal: true });

    const nameIdFilter = searchParams.get('name_id')
        ?.split(',')
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


    const rawSearch = searchParams.get("search");
    const searchString = rawSearch ? decodeURIComponent(rawSearch).trim() : undefined;

    const reverse = searchParams.get('reverse') === 'true';

    const entries = await prisma.osEntry.findMany({
        where: {
            AND: [
                ...(kindFilters.length > 0 ? [{ OR: kindFilters }] : []),
                ...(filtersEnabled && !sdk ? [{ is_sdk: false }] : []),
                ...(filtersEnabled && !simulator ? [{ is_simulator: false }] : []),
                ...(nameIdCondition ? [nameIdCondition] : []),
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
                { release_datetime: reverse ? 'asc' : 'desc' },
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
        },
    });

    if (!searchString) {
        setCache(cacheKey, entries);
    }

    return Response.json(entries);
}
