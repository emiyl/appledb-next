'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { obfuscateNumber } from "@/utils/obfuscate";
import styles from '@/styles/DeviceEntry.module.scss';
import { EntryList } from "./EntryList";
import { EntryType } from "@/types/EntryType";

type DeviceMapRelease = {
    datetime: string;
    depth: number;
};

type Device = {
    name: string;
    releaseDateString: string;
    category: {
        id: number;
        name: string;
    }[];
    ids: number[];
    identifiers: string[];
    models: string[];
    socs: string[];
    archs: string[];
    boards: string[];
    deviceImageKey: string;
    deviceImageColors: { name: string; dark_mode: boolean }[];
};

function formatReleaseDates(deviceMapRelease: DeviceMapRelease[] = []) {
    return deviceMapRelease
        .slice()
        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
        .filter(el => el.depth > 0)
        .map(el => {
            const date = new Date(el.datetime);
            if (el.depth === 1) {
                return date.getFullYear();
            } else if (el.depth === 2) {
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short"
                });
            } else {
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                });
            }
        })
        .map((el, idx, arr) => {
            // Only include unique formatted dates
            return arr.indexOf(el) === idx ? el : null;
        })
        .filter(Boolean)
        .join(", ");
}

function normalizeDevices(devices: any[]): Device {
    const device: Device = {
        name: "Unknown device",
        releaseDateString: "Unknown",
        category: [{
            id: 0,
            name: "Unknown"
        }],
        ids: [],
        identifiers: [],
        models: [],
        socs: [],
        archs: [],
        boards: [],
        deviceImageKey: "",
        deviceImageColors: []
    }

    if (devices.length == 1) {
        const singleDevice = devices[0];
        device.name = singleDevice.name;
        device.deviceImageKey = singleDevice.DeviceLookupImage.name;
        device.deviceImageColors = singleDevice.DeviceLookupImage.DeviceImageColors.map((e: any) => {
            return {
                name: e.ColorLookup.name,
                dark_mode: e.dark_mode
            }
        });
    } else {
        device.name = "Unknown device group"
    }

    let release_dates: any[] = []
    let categories = new Set<{ id: number; name: string }>();
    let ids = new Set<number>();
    let identifiers = new Set<string>();
    let models = new Set<string>();
    let socs = new Set<string>();
    let archs = new Set<string>();
    let boards = new Set<string>();

    for (const dev of devices) {
        ids.add(dev.id);

        if (dev.DeviceMapRelease) {
            release_dates.push(...dev.DeviceMapRelease);
        }
        if (dev.DeviceLookupCategory) {
            if (![...categories].some(c => c.id === dev.category_id)) {
                categories.add({
                    id: dev.category_id,
                    name: dev.DeviceLookupCategory.name
                });
            }
        }
        if (dev.DeviceMapIdentifier) {
            for (const identifierItem of dev.DeviceMapIdentifier) {
                identifiers.add(identifierItem.identifier);
            }
        }
        if (dev.DeviceMapModel) {
            for (const modelItem of dev.DeviceMapModel) {
                models.add(modelItem.model);
            }
        }
        if (dev.DeviceMapSoc) {
            for (const socItem of dev.DeviceMapSoc) {
                socs.add(socItem.DeviceLookupSoc.name);
            }
        }
        if (dev.DeviceMapArchitecture) {
            for (const archItem of dev.DeviceMapArchitecture) {
                archs.add(archItem.DeviceLookupArchitecture.name);
            }
        }
        if (dev.DeviceMapBoard) {
            for (const boardItem of dev.DeviceMapBoard) {
                boards.add(boardItem.DeviceLookupBoard.name);
            }
        }
    }

    device.releaseDateString = formatReleaseDates(release_dates);
    device.category = Array.from(categories);
    device.ids = Array.from(ids);
    device.identifiers = Array.from(identifiers).sort();
    device.models = Array.from(models).sort();
    device.socs = Array.from(socs).sort();
    device.archs = Array.from(archs).sort();
    device.boards = Array.from(boards).sort();

    return device
}

type DeviceEntryProps = {
    deviceIds: string[];
};

const DeviceEntry: React.FC<DeviceEntryProps> = ({ deviceIds }) => {
    const [device, setDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (deviceIds.length === 0) {
            setDevice(null);
            setLoading(false);
            return;
        }
        const idsParam = deviceIds.join(';');
        fetch(`/api/device?device_id=${idsParam}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch device");
                return res.json();
            })
            .then((data: any | any[] | null) => {
                if (Array.isArray(data)) {
                    setDevice(normalizeDevices(data.filter(Boolean)));
                } else if (data) {
                    setDevice(normalizeDevices([data]));
                } else {
                    setDevice(null);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [deviceIds]);

    if (loading) return <div>Loading device...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!device) return <div>
        <h1>Error</h1>
        <p>No device found.</p>
    </div>;

    return (
        <div>
            <DeviceHeader device={device} />
            <DeviceInfoTable device={device} />
            <h2 style={{ marginBottom: "1.1em" }}>Firmware versions</h2>
            <div>
                <EntryList entryType={EntryType.Os} overrideFilter={{
                    "filters": {
                        "device": {
                            "label": "Device",
                            "active": device.ids.map(id => ({ id, name: id.toString() })),
                            "hidden": true,
                            "apiParam": "device_id",
                            "apiRoute": "/api/device-names"
                        },
                        "os_name": {
                            "label": "",
                            "active": [],
                            "hidden": true
                        }
                    }
                }} />
            </div>
        </div>
    );
};

type TitleProps = {
    name: string;
    releaseDate: string;
    categoryLink: React.ReactNode;
};

const Title: React.FC<TitleProps> = ({ name, releaseDate, categoryLink }) => (
    <div className={styles.title}>
        <h1>{name}</h1>
        <p>
            {releaseDate} — {Array.isArray(categoryLink) ? categoryLink.reduce((prev, curr, idx) => [
                prev,
                idx > 0 && ", ",
                curr
            ], []) : categoryLink}
        </p>
    </div>
);

type DeviceImageProps = {
    deviceImageKey: string;
    name: string;
    color: { name: string; dark_mode: boolean };
};

const DeviceImage: React.FC<DeviceImageProps> = ({ deviceImageKey, name, color }) => (
    <div className={styles.deviceImage}>
        <picture>
            <source srcSet={`https://img.appledb.dev/device@main/${deviceImageKey}/${color.name}.avif`} type="image/avif" />
            <source srcSet={`https://img.appledb.dev/device@main/${deviceImageKey}/${color.name}.webp`} type="image/webp" />
            <img src={`https://img.appledb.dev/device@main/${deviceImageKey}/${color.name}.png`} alt={name} loading="lazy" />
        </picture>
    </div>
);

type DeviceHeaderProps = {
    device: Device;
};

const DeviceHeader: React.FC<DeviceHeaderProps> = ({ device }) => {
    const deviceName = device.name || "Unknown Device";
    const deviceReleaseDate = device.releaseDateString || "Unknown release date";
    const deviceCategoryLink = device.category.map((c: { id: number; name: string }) => (
        <Link key={c.id} href={`/device?category=${c.id}`}>
            {c.name}
        </Link>
    ));

    const deviceImageKey = device.deviceImageKey || "";
    const deviceImageColor = device.deviceImageColors?.[0] || { name: "0", dark_mode: true };

    return (
        <div className={styles.deviceHeader}>
            {deviceImageKey &&
                <DeviceImage
                    name={deviceName}
                    deviceImageKey={deviceImageKey}
                    color={deviceImageColor}
                />
            }
            <Title
                name={deviceName}
                releaseDate={deviceReleaseDate}
                categoryLink={deviceCategoryLink}
            />
        </div>
    );
};

type DeviceInfoTableProps = {
    device: Device;
};

const DeviceInfoTable: React.FC<DeviceInfoTableProps> = ({ device }) => {
    const [infoItems, setInfoItems] = useState([
        { label: "Identifier", values: device.identifiers },
        { label: "Model", values: device.models },
        { label: "System on Chip (SoC)", values: device.socs },
        { label: "Architecture", values: device.archs },
        { label: "Board", values: device.boards }
    ].map(item => ({
        ...item,
        visibleItems: 3
    })));

    return (
        (
            infoItems.some(({ values }) => values.length > 0) && (
                <div className={styles.infoTable}>
                    {infoItems.map(({ label, values, visibleItems }) =>
                        values.length > 0 && (
                            <React.Fragment key={label}>
                                <h5>{label}</h5>
                                <p>
                                    {values.slice(0, visibleItems).join(", ")}
                                    {values.length > visibleItems && (
                                        <span> and {values.length - visibleItems} more
                                            <a
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setInfoItems(prev =>
                                                        prev.map(item =>
                                                            item.label === label
                                                                ? { ...item, visibleItems: values.length }
                                                                : item
                                                        )
                                                    );
                                                }}
                                                style={{ cursor: "pointer" }}
                                            > ...</a>
                                        </span>
                                    )}
                                </p>
                            </React.Fragment>
                        )
                    )}
                </div>
            )
        )
    );
};

export default DeviceEntry;