import styles from '@/styles/layout.module.scss';
import DeviceEntry from '@/components/DeviceEntry';

export default function DeviceEntryPage({ params }: { params: any }) {
  const deviceIds = params.device_id.split(',').map((id: any) => id.trim()).filter(Boolean);

  return (
    <main className={styles.content}>
      <DeviceEntry deviceIds={deviceIds} />
    </main>
  );
}