import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const reverse = searchParams.get('reverse') === 'true';

    const entries = await prisma.$queryRawUnsafe(`
        SELECT
            d.id,
            d.name,

            json_build_object(
                'name', c.name
            ) AS "DeviceLookupCategory",

            json_build_object(
                'name', i.name,
                'DeviceImageColors', COALESCE(json_agg(DISTINCT
                jsonb_build_object(
                    'dark_mode', ic.dark_mode,
                    'ColorLookup', jsonb_build_object('name', clr.name)
                )
                ) FILTER (WHERE ic.device_image_id IS NOT NULL), '[]')
            ) AS "DeviceLookupImage",

            COALESCE(json_agg(DISTINCT
                jsonb_build_object(
                'DeviceLookupArchitecture', jsonb_build_object('name', arch.name)
                )
            ) FILTER (WHERE dma.device_id IS NOT NULL), '[]') AS "DeviceMapArchitecture",

            COALESCE(json_agg(DISTINCT
                jsonb_build_object('identifier', ident.identifier)
            ) FILTER (WHERE ident.device_id IS NOT NULL), '[]') AS "DeviceMapIdentifier",

            COALESCE(json_agg(DISTINCT
                jsonb_build_object('model', m.model)
            ) FILTER (WHERE m.device_id IS NOT NULL), '[]') AS "DeviceMapModel",

            COALESCE(json_agg(DISTINCT
                jsonb_build_object(
                'datetime', r.datetime,
                'depth', r.depth
                )
            ) FILTER (WHERE r.device_id IS NOT NULL), '[]') AS "DeviceMapRelease",

            COALESCE(json_agg(DISTINCT
                jsonb_build_object(
                'DeviceLookupSoc', jsonb_build_object('name', soc.name)
                )
            ) FILTER (WHERE ds.device_id IS NOT NULL), '[]') AS "DeviceMapSoc"

        FROM "DeviceEntry" d

        LEFT JOIN "DeviceLookupCategory" c ON c.id = d.category_id
        LEFT JOIN "DeviceLookupImage" i ON i.id = d.image_id
        LEFT JOIN "DeviceImageColors" ic ON ic.device_image_id = i.id
        LEFT JOIN "ColorLookup" clr ON clr.id = ic.color_id

        LEFT JOIN "DeviceMapArchitecture" dma ON dma.device_id = d.id
        LEFT JOIN "DeviceLookupArchitecture" arch ON arch.id = dma.architecture_id

        LEFT JOIN "DeviceMapIdentifier" ident ON ident.device_id = d.id

        LEFT JOIN "DeviceMapModel" m ON m.device_id = d.id

        LEFT JOIN "DeviceMapRelease" r ON r.device_id = d.id

        LEFT JOIN "DeviceMapSoc" ds ON ds.device_id = d.id
        LEFT JOIN "DeviceLookupSoc" soc ON soc.id = ds.soc_id

        GROUP BY d.id, c.name, i.name

        ORDER BY MIN(r.datetime) DESC NULLS LAST
        OFFSET $1
        LIMIT $2;
    `, offset, limit);

    // const entries = await prisma.deviceEntry.findMany({
    //     orderBy: {
    //         id: 'asc',
    //     },
    //     skip: offset,
    //     take: limit,
    //     include: {
    //         DeviceLookupCategory: {
    //             select: { name: true, }
    //         },
    //         DeviceLookupImage: {
    //             select: {
    //                 name: true,
    //                 DeviceImageColors: {
    //                     select: {
    //                         dark_mode: true,
    //                         ColorLookup: {
    //                             select: { name: true, }
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         DeviceMapArchitecture: {
    //             select: {
    //                 DeviceLookupArchitecture: {
    //                     select: { name: true },
    //                 },
    //             },
    //         },
    //         DeviceMapIdentifier: {
    //             select: { identifier: true, },
    //         },
    //         DeviceMapModel: {
    //             select: { model: true, },
    //         },
    //         DeviceMapRelease: {
    //             select: {
    //                 datetime: true,
    //                 depth: true
    //             }
    //         },
    //         DeviceMapSoc: {
    //             select: {
    //                 DeviceLookupSoc: {
    //                     select: { name: true, }
    //                 }
    //             }
    //         },
    //     },
    // });

    return Response.json(entries);
}
