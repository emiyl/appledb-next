import React from 'react';
import styles from '@/styles/DeviceEntryListRow.module.scss';
import { DeviceEntry } from '@/types'
import { formatDateToString } from '@/utils';

interface OsEntryListRowProps {
    entry: DeviceEntry;
}

const OsEntryListRow: React.FC<OsEntryListRowProps> = ({ entry }) => {

    let device_image = entry.DeviceLookupImage

    let image = device_image.name || 'logo';
    let colors = device_image.DeviceImageColors && device_image.DeviceImageColors.length > 0 
        ? device_image.DeviceImageColors.map(color => color.ColorLookup.name) 
        : ['0'];

    let architectures = entry.DeviceMapArchitecture.map(arch => arch.DeviceLookupArchitecture.name);
    let identifiers = entry.DeviceMapIdentifier.map(id => id.identifier);
    let models = entry.DeviceMapModel.map(model => model.model);
    let socs = entry.DeviceMapSoc.map(soc => soc.DeviceLookupSoc.name);
    let releaseDate = entry.DeviceMapRelease.map(release => formatDateToString(new Date(release.datetime), release.depth));

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
                    {identifiers.length > 0 && <li>Identifier{identifiers.length > 1 ? 's' : ''}: {identifiers.join(', ')}</li>}
                    {socs.length > 0 && <li>SoC{socs.length > 1 ? 's' : ''}: {socs.join(', ')}</li>}
                    {models.length > 0 && <li>Model{models.length > 1 ? 's' : ''}: {models.join(', ')}</li>}
                    <li><a href="#">View more</a></li>
                </ul>
                {releaseDate.length > 0 && <div className={styles.releaseDate}>Released on {releaseDate[0]}</div>}
            </div>
        </div>
    );
};

export default OsEntryListRow;
