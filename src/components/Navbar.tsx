'use client'
import Link from 'next/link';
import styles from '../styles/Navbar.module.scss';
import React from 'react';
import { isDarkModeFunc } from '@/utils';

interface NavbarItem {
    title: string;
    route: string;
}

const navbarItems: NavbarItem[] = [
    { title: 'Devices', route: '/device' },
    { title: 'Firmware', route: '/firmware' },
];

export default function Navbar() {
    const isDarkMode = isDarkModeFunc();

    return (
        <header className={styles.navbar}>
            <Link href="/">
                <img
                    src={`https://img.appledb.dev/images@64/logo/0${isDarkMode ? '_dark' : ''}.png`}
                    alt="AppleDB Logo"
                    className={styles.logo}
                    width={31}
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
