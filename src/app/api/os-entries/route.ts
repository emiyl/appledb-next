import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

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

    return Response.json(entries);
}
