import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const reverse = searchParams.get('reverse') === 'true';

    const entries = await prisma.deviceEntry.findMany({
        where: {},
        orderBy: {},
        skip: offset,
        take: limit,
    });

    return Response.json(entries);
}
