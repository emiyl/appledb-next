import { Suspense } from 'react';
import { EntryList } from '@/components/EntryList';
import { EntryType } from '@/types';
import styles from '@/styles/layout.module.scss';

export default function OsEntryListPage() {
  return (
    <main className={styles.content}>
      <h1>Firmware Table</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <EntryList entryType={EntryType.Os} />
      </Suspense>
    </main>
  );
}