import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Mapping = { device_id: number };
type DeviceEntry = { id: number };

export async function GET() {
    // Find all unique device IDs that are mapped to an OS entry via MapDeviceOs
    const mappings: Mapping[] = await prisma.mapDeviceOs.findMany({
        select: { device_id: true },
        distinct: ['device_id'],
    });

    const deviceIds = mappings.map(m => m.device_id);

    // Query DeviceEntry for these device IDs
    const devices: DeviceEntry[] = await prisma.deviceEntry.findMany({
        where: { id: { in: deviceIds } },
        select: { id: true },
    });

    // Output array of ids
    const result = devices.map(device => device.id);

    return NextResponse.json(result);
}
