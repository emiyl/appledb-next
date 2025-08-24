import styles from '@/styles/layout.module.scss';
import DeviceEntry from '@/components/DeviceEntry';

interface DeviceEntryPageProps {
    params: {
        device_id: string;
    };
}

export default function DeviceEntryPage({ params }: DeviceEntryPageProps) {
    const { device_id } = params;
    const deviceIds = device_id.split(',').map(id => id.trim()).filter(Boolean);
    return (
        <main className={styles.content}>
            <DeviceEntry deviceIds={deviceIds} />
        </main>
    );
}