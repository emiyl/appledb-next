import React from 'react';
import styles from '@/styles/DeviceEntryListRow.module.scss';
import { DeviceEntry } from '@/types'
import { formatDateToString } from '@/utils';

interface OsEntryListRowProps {
    entry: DeviceEntry;
}

const OsEntryListRow: React.FC<OsEntryListRowProps> = ({ entry }) => {

    let device_image = entry.DeviceLookupImage
    let image = 'logo';
    let colors = ['0'];

    if (device_image) {
        image = device_image.name;
        colors = device_image.DeviceImageColors && device_image.DeviceImageColors.length > 0 
            ? device_image.DeviceImageColors.map(color => color.ColorLookup.name) 
            : ['0'];
    }

    // console.log(entry);

    return (
        <div className={styles.row}>
            <div className={styles.column}>
                <h3>{entry.name}</h3>
                <div className={styles.imageWrapper}>
                    <picture>
                        <source srcSet={`https://img.appledb.dev/device@main/${image}/${colors[0]}.avif`} type="image/avif" />
                        <source srcSet={`https://img.appledb.dev/device@main/${image}/${colors[0]}.webp`} type="image/webp" />
                        <img src={`https://img.appledb.dev/device@main/${image}/${colors[0]}.png`} alt={entry.name} />
                    </picture>
                </div>
            </div>
            <div className={styles.column}>
                <ul>
                    <li>Identifier: iPhone1,1</li>
                    <li>SoC: APL0098</li>
                    <li>Model: A1203</li>
                    <li><a href="#">View more</a></li>
                </ul>
                <div className={styles.releaseDate}>Released on June 29, 2007</div>
            </div>
        </div>
    );
};

export default OsEntryListRow;
