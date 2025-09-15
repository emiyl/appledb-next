import React from 'react';
import Link from 'next/link';
import styles from '@/styles/DeviceEntryListItem.module.scss';
import { DeviceEntry } from '@/types'
import { formatDateToString, isDarkModeFunc } from '@/utils';
import { obfuscateNumber } from '@/utils/obfuscate';
import Image from './Image';

interface OsEntryListRowProps {
    entry: DeviceEntry;
}

const OsEntryListItem: React.FC<OsEntryListRowProps> = ({ entry }) => {
    let device_image = entry.DeviceLookupImage
    const isDarkMode = isDarkModeFunc();

    let image = device_image.name || 'logo';
    let colors = device_image.DeviceImageColors && device_image.DeviceImageColors.length > 0
        ? device_image.DeviceImageColors.map(color => [color.ColorLookup.name, color.dark_mode && isDarkMode ? '_dark' : ''].join(''))
        : [['0', isDarkMode ? '_dark' : ''].join('')];

    let architectures = entry.DeviceMapArchitecture.map(arch => arch.DeviceLookupArchitecture.name);
    let identifiers = entry.DeviceMapIdentifier.map(id => id.identifier);
    let models = entry.DeviceMapModel.map(model => model.model);
    let socs = entry.DeviceMapSoc.map(soc => soc.DeviceLookupSoc.name);
    let releaseDate = entry.DeviceMapRelease.map(release => formatDateToString(new Date(release.datetime), release.depth));

    return (
        <div className={styles.row}>
            <div className={styles.column}>
                <Link href={`/device/${entry.name.replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}.${obfuscateNumber(entry.id)}`}>
                    <h3 className={styles.deviceName}>{entry.name}</h3>
                    <div className={styles.imageWrapper}>
                        {colors.slice(0, 3).map((color, idx) => (
                            <Image
                                key={idx}
                                src={`https://img.appledb.dev/device@main/${image}/${color}`}
                                alt={entry.name}
                                className={styles.imageItem}
                            />
                        ))}
                    </div>
                </Link>
            </div>
            <div className={styles.column}>
                <ul>
                    {identifiers.length > 0 && <li>Identifier{identifiers.length > 1 ? 's' : ''}: {identifiers.join(', ')}</li>}
                    {socs.length > 0 && <li>SoC{socs.length > 1 ? 's' : ''}: {socs.join(', ')}</li>}
                    {models.length > 0 && <li>Model{models.length > 1 ? 's' : ''}: {models.join(', ')}</li>}
                    {releaseDate.length > 0 ? <li>Released on {releaseDate[0]}</li> : <li>Unknown release date</li>}
                </ul>
                <div className={styles.deviceLink}>
                    <Link href={`/device/${entry.name.replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}.${obfuscateNumber(entry.id)}`}>View device page</Link>
                </div>
            </div>
        </div>
    );
};

export default OsEntryListItem;
