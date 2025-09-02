import styles from '@/styles/layout.module.scss';
import { Suspense } from 'react';
import { EntryList } from '@/components/EntryList';
import { EntryType } from '@/types';

export default function DeviceEntryListPage() {
    return (
        <main className={styles.content}>
            <h1>Device List</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <EntryList entryType={EntryType.Device} />
            </Suspense>
        </main>
    );
}