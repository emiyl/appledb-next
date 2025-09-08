import styles from '@/styles/layout.module.scss';
import { obfuscateNumber, deobfuscateNumber } from '@/utils/obfuscate';
import { EntryList } from '@/components/EntryList';
import { EntryType } from '@/types';

const overrides = [
    {
        "name": "Mac",
        "ids": [24,25,26,27,28,29,30,37,47,50]
    },
    {
        "name": "iPad",
        "ids": [51,52,53,54]
    },
    {
        "name": "iPod",
        "ids": [56,57,58,59,60]
    }
]

type DeviceCategory = { id: number; name: string };

let cachedCategories: DeviceCategory[] = [];

async function getDeviceCategories(): Promise<DeviceCategory[]> {
    if (cachedCategories.length > 0) return cachedCategories;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/device-categories`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch device categories');
    }
    cachedCategories = await res.json();
    return cachedCategories;
}

async function findDeviceCategory(identifier: string | number): Promise<DeviceCategory | null> {
    const categories = await getDeviceCategories();
    if (typeof identifier === "number" || /^\d+$/.test(identifier as string)) {
        const id = Number(identifier);
        return categories.find(category => category.id === id) || null;
    } else {
        return categories.find(category => category.name === identifier) || null;
    }
}

export default async function DeviceEntryListPage({ params }: { params: any }) {
    const { slug } = params;
    const categories = slug.split(encodeURIComponent(';'));
    const ids = categories.map((d: string) => d.split('.').pop());

    if (!ids) {
        return <div>No device category found</div>;
    }

    const obfuscatedCategoryIds = ids.map((id: string) => id);
    let categoriesData: DeviceCategory[] = [];
    try {
        const deobfuscatedIds = obfuscatedCategoryIds.map((id: string) => deobfuscateNumber(id).toString());
        const foundCategories = await Promise.all(
            deobfuscatedIds.map(async (id: string) => {
                const cat = await findDeviceCategory(id);
                return cat ? cat : { id: Number(id), name: id.toString() };
            })
        );
        categoriesData = foundCategories;
    } catch (error) {
        try {
            const searchString = decodeURIComponent(slug.replace(`.${ids}`, '').replace(/-/g, ' '));
            const category = await findDeviceCategory(searchString);
            if (category) {
                categoriesData = [category];
            }
        } catch (error) {
            return <main className={styles.content}>
                <h1>Error</h1>
                <p>Error decoding category IDs</p>
            </main>;
        }
    }

    if (!categoriesData.length) {
        return <main className={styles.content}>
            <h1>Error</h1>
            <p>Error decoding category IDs</p>
        </main>;
    }

    const override = overrides.find(o =>
        o.ids.every(id => categoriesData.some(cat => cat.id === id)) &&
        o.ids.length === categoriesData.length
    );

    const title = override ? override.name : categoriesData.map(cat => cat.name).join(', ');

    return (
        <main className={styles.content}>
            <h1 style={{marginBottom: '28px'}}>Device List ({title})</h1>
            <EntryList entryType={EntryType.Device} overrideFilter={{
                "filters": {
                    "category": {
                        "label": "Device category",
                        "active": categoriesData.map(cat => ({ id: cat.id, name: cat.name })),
                        "hidden": true,
                        "apiParam": "category_id",
                        "apiRoute": "/api/device-categories"
                    }
                }
            }} />
        </main>
    );
}