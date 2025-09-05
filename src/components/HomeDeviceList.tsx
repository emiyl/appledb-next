import React from 'react';
import Image from '@/components/Image'
import styles from '@/styles/HomeDeviceList.module.scss';

const HomeDeviceList = () => {
    return (
        <div className={styles.gridView}>
            {[
                {
                    src: "https://img.appledb.dev/images@256/mac_combo/0",
                    alt: "Mac Devices",
                    label: "Mac"
                },
                {
                    src: "https://img.appledb.dev/images@256/iphone_combo/0",
                    alt: "iPhones",
                    label: "iPhone"
                },
                {
                    src: "https://img.appledb.dev/images@256/ipad_combo/0",
                    alt: "iPads",
                    label: "iPad"
                },
                {
                    src: "https://img.appledb.dev/device@256/Watch7,8/Silver",
                    alt: "Apple Watches",
                    label: "Apple Watch"
                },
                {
                    src: "https://img.appledb.dev/device@256/AppleTV14,1/0",
                    alt: "Apple TVs",
                    label: "Apple TV"
                },
                {
                    src: "https://img.appledb.dev/device@256/AudioAccessory6,1/Midnight",
                    alt: "HomePods",
                    label: "HomePod"
                },
                {
                    src: "https://img.appledb.dev/images@256/airpods_4/0",
                    alt: "AirPods",
                    label: "AirPods"
                },
                {
                    src: "https://img.appledb.dev/device@256/iPod classic/0",
                    alt: "iPods",
                    label: "iPod"
                }
            ].map(device => (
                <div className={styles.gridBox} key={device.label}>
                    <Image src={device.src} alt={device.alt} className={styles.gridImage} />
                    <h3>{device.label}</h3>
                </div>
            ))}
        </div>
    );
};

export default HomeDeviceList;