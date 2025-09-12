import { deobfuscateNumber } from '@/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function FirmwarePage({ params }: { params: any }) {
    const { slug } = await params;
    const firmwares = slug.split(encodeURIComponent(';'));
    const obfuscatedFirmwareIDs = firmwares.map((d: string) => d.split('.').pop());

    if (!obfuscatedFirmwareIDs) {
        notFound();
    }

    const firmwareIDs = obfuscatedFirmwareIDs.map((id: string) => {
        if (typeof id !== 'string') {
            notFound();
        }
        try {
            return deobfuscateNumber(id).toString();
        } catch (error) {
            notFound();
        }
    });

    return (
        <main>
            <h1>Firmware: {slug}</h1>
            {/* Render firmware details here */}
            <p>Firmware details will appear here.</p>
        </main>
    );
}