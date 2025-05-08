import { OsEntryList } from '@/components/OsEntryList';
import styles from '@/styles/layout.module.scss';

export default function OsEntriesPage() {
  return (
    <main className={styles.content}>
      <h1>Firmware Table</h1>
      <OsEntryList />
    </main>
  );
}