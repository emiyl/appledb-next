import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Navbar.module.scss';

interface NavbarItem {
    title: string;
    route: string;
}

const navbarItems: NavbarItem[] = [
    // { title: 'Device Entry List', route: '/device-entry-list' },
    { title: 'Firmware Table', route: '/os-entry-list' },
];

export default function Navbar() {
    return (
        <header className={styles.navbar}>
            <Link href="/">
                <Image
                    src="https://img.appledb.dev/images@64/logo/0.png"
                    alt="AppleDB Logo"
                    className={styles.logo}
                    width={35}
                    height={35}
                />
                <span className={styles.siteName}>AppleDB</span>
            </Link>
            <div className={styles.navbarItemsWrapper}>
                <nav className={styles.navbarItems}>
                    {navbarItems.map((item, index) => (
                        <div className={styles.navbarItem} key={index}>
                            <Link href={item.route}>
                                {item.title}
                            </Link>
                        </div>
                    ))}
                </nav>
            </div>
        </header>
    );
}
