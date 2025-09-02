'use client'
import styles from '@/styles/layout.module.scss';
import { EntryList } from '@/components/EntryList';
import { EntryType, DeviceEntryListFilter } from '@/types';
import { defaultDeviceEntryListFilter } from '@/utils';
import { useSearchParams } from 'next/navigation';
import { obfuscateNumber, deobfuscateNumber } from '@/utils/obfuscate';

export default function DeviceEntryListPage() {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const defaultFilter = {
    ...defaultDeviceEntryListFilter,
    search: params.search || defaultDeviceEntryListFilter.search,
    filter_id: params.category
      ? params.category
          .split(',')
          .map((item) => {
            const id = item/*.split('.').pop() ?? ''*/;
            return deobfuscateNumber(parseInt(id));
          })
      : defaultDeviceEntryListFilter.filter_id,
  };

  return (
    <main className={styles.content}>
      <h1>Device List</h1>
      <EntryList entryType={EntryType.Device} defaultFilter={defaultFilter} />
    </main>
  );
}