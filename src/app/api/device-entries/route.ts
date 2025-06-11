import { DeviceImageColors } from './../../../generated/prisma/index.d';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const reverse = searchParams.get('reverse') === 'true';

    const entries = await prisma.deviceEntry.findMany({
        orderBy: {
            id: 'asc',
        },
        skip: offset,
        take: limit,
        include: {
            DeviceLookupCategory: {
                select: { name: true, }
            },
            DeviceLookupImage: {
                select: {
                    name: true,
                    DeviceImageColors: {
                        select: {
                            dark_mode: true,
                            ColorLookup: {
                                select: { name: true, }
                            }
                        }
                    }
                }
            },
            DeviceMapArchitecture: {
                select: {
                    DeviceLookupArchitecture: {
                        select: { name: true },
                    },
                },
            },
            DeviceMapIdentifier: {
                select: { identifier: true, },
            },
            DeviceMapModel: {
                select: { model: true, },
            },
            DeviceMapRelease: {
                select: {
                    datetime: true,
                    depth: true
                }
            },
            DeviceMapSoc: {
                select: {
                    DeviceLookupSoc: {
                        select: { name: true, }
                    }
                }
            },
        },
    });

    return Response.json(entries);
}
