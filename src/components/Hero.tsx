import Link from 'next/link';
import styles from '@/styles/Hero.module.scss';
import { prisma } from '@/lib/prisma';

interface HeroItem {
    title: string;
    description: string;
    image: string;
    route: string;
}

const getHeroItems = (osEntryCount: number, deviceEntryCount: number): HeroItem[] => {
    const osEntryCountFormatted = osEntryCount.toLocaleString();
    const deviceEntryCountFormatted = deviceEntryCount.toLocaleString();

    return [
        {
            title: 'Devices',
            description: `${deviceEntryCountFormatted} products`,
            image: 'https://img.appledb.dev/device@64/iPod classic/0.png',
            route: '/device',
        },
        {
            title: 'Firmware',
            description: `${osEntryCountFormatted} firmware versions`,
            image: 'https://img.appledb.dev/images@64/Sequoia/0.png',
            route: '/firmware',
        },
    ];
};

interface HeroItemsProps {
    osEntryCount: number;
    deviceEntryCount: number;
}

const HeroItems: React.FC<HeroItemsProps> = ({ osEntryCount, deviceEntryCount }) => {
    const heroItems = getHeroItems(osEntryCount, deviceEntryCount);

    return (
        <div className={styles.heroItems}>
            {heroItems.map((item, index) => (
                <Link key={index} href={item.route}>
                    <div className={styles.heroItem}>
                        <div className={styles.heroItemImage}>
                            <picture>
                                <img src={item.image} alt={item.title} />
                            </picture>
                        </div>
                        <div className={styles.heroItemText}>
                            <h2>
                                {item.title} <i className="fa-solid fa-chevron-right" />
                            </h2>
                            <p>{item.description}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

const osEntryCount = await prisma.osEntry.count();
const deviceEntryCount = await prisma.deviceEntry.count();

const Hero: React.FC = () => {
    return (
        <div className={styles.hero}>
            <div className={styles.heroHeader}>
                <h1>
                    <span className={styles.gradientText}>{ process.env.NEXT_PUBLIC_SITE_TITLE || 'Default Site Title' }</span>
                </h1>
                <p>{process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Default description'}</p>
            </div>
            <HeroItems osEntryCount={osEntryCount} deviceEntryCount={deviceEntryCount} />
        </div>
    );
};

export default Hero;