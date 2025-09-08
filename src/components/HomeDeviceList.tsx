import React from 'react';
import Image from '@/components/Image'
import styles from '@/styles/HomeDeviceList.module.scss';
import { obfuscateNumber } from '@/utils';
import Link from 'next/link';

const HomeDeviceList = () => {
    return (
        <div className={styles.gridView}>
            {[
                {
                    src: "https://img.appledb.dev/images@256/mac_combo/0",
                    alt: "Mac Devices",
                    label: "Mac",
                    link: `/device/category/Macs`
                },
                {
                    src: "https://img.appledb.dev/images@256/iphone_combo/0",
                    alt: "iPhones",
                    label: "iPhone",
                    link: `/device/category/iPhone.${obfuscateNumber(55)}`
                },
                {
                    src: "https://img.appledb.dev/images@256/ipad_combo/0",
                    alt: "iPads",
                    label: "iPad",
                    link: `/device/category/iPads`
                },
                {
                    src: "https://img.appledb.dev/device@256/Watch7,8/Silver",
                    alt: "Apple Watches",
                    label: "Apple Watch",
                    link: `/device/category/Apple-Watch.${obfuscateNumber(8)}`
                },
                {
                    src: "https://img.appledb.dev/device@256/AppleTV14,1/0",
                    alt: "Apple TVs",
                    label: "Apple TV",
                    link: `/device/category/Apple-TV.${obfuscateNumber(7)}`
                },
                {
                    src: "https://img.appledb.dev/device@256/AudioAccessory6,1/Midnight",
                    alt: "HomePods",
                    label: "HomePod",
                    link: `/device/category/HomePod.${obfuscateNumber(22)}`
                },
                {
                    src: "https://img.appledb.dev/images@256/airpods_4/0",
                    alt: "AirPods",
                    label: "AirPods",
                    link: `/device/category/AirPods.${obfuscateNumber(3)}`
                },
                {
                    src: "https://img.appledb.dev/device@256/iPod classic/0",
                    alt: "iPods",
                    label: "iPod",
                    link: `/device/category/iPods`
                }
            ].map(device => (
                <Link key={device.label} href={device.link}>
                    <div className={styles.gridBox}>
                        <Image src={device.src} alt={device.alt} className={styles.gridImage} />
                        <h3>{device.label}</h3>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default HomeDeviceList;