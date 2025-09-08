import styles from '@/styles/layout.module.scss';
import DeviceEntry from '@/components/DeviceEntry';
import { deobfuscateNumber } from '@/utils/obfuscate';

async function findDeviceId(name: string) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const url = `${baseUrl}/api/device?legacyKey=${name}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch device');
    }
    const data = await res.json();
    return data;
}

export default async function DeviceEntryPage({ params }: { params: any }) {
    const { slug } = await params;
    const devices = slug.split(encodeURIComponent(';'));
    const ids = devices.map((d: string) => d.split('.').pop());

    if (!ids) {
        return <div>No device found</div>;
    }

    const obfuscatedDeviceIds = ids.map((id: string) => id);
    let deviceIds: string[] = [];
    try {
        deviceIds = obfuscatedDeviceIds.map((id: string) => deobfuscateNumber(id).toString());
    } catch (error) {
        try {
            const searchString = decodeURIComponent(slug.replace(`.${ids}`, '').replace(/-/g, ' '));
            const devices = await findDeviceId(searchString);
            if (devices.length > 0) {
                deviceIds = [devices.map((d: any) => d.id.toString())[0]];
            }
        } catch (error) {
            return <main className={styles.content}>
                <h1>Error</h1>
                <p>Error decoding device IDs</p>
            </main>;
        }
    }

    return (
        <main className={styles.content}>
            <DeviceEntry deviceIds={deviceIds} />
        </main>
    );
}