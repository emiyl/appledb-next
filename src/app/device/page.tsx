import styles from '@/styles/layout.module.scss';
import { EntryList } from '@/components/EntryList';
import { EntryType } from '@/types';

export default function DeviceEntryListPage() {
  return (
    <main className={styles.content}>
      <h1>Device List</h1>
      <EntryList entryType={EntryType.Device} />
    </main>
  );
}