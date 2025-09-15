import { deobfuscateNumber } from '@/utils';
import OsEntry from '@/components/OsEntry';
import { notFound } from 'next/navigation';
import styles from '@/styles/layout.module.scss';

export default async function FirmwarePage({ params }: { params: any }) {
    const { slug } = await params;
    const obfuscatedFirmwareID = slug.split('.').pop();

    if (!obfuscatedFirmwareID) {
        notFound();
    }

    const firmwareID = deobfuscateNumber(obfuscatedFirmwareID).toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/firmware?id=${firmwareID}`);
    if (!res.ok) {
        notFound();
    }
    const firmware = await res.json();

    return (
        <main className={styles.content}>
            <OsEntry entry={firmware[0]} />
        </main>
    );
}