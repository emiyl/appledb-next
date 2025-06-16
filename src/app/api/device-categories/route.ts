import { prisma } from '@/lib/prisma';

export async function GET() {
    const entries = await prisma.deviceLookupCategory.findMany();
    const result = entries.map(entry => ({
        id: entry.id,
        name: entry.name,
    }));

    return Response.json(result);
}
