import styles from '@/styles/layout.module.scss';
import { DeviceEntryList } from '@/components/DeviceEntryList';

export default function DeviceEntriesPage() {
  return (
    <main className={styles.content}>
      <h1>Device List</h1>
      <DeviceEntryList />
    </main>
  );
}