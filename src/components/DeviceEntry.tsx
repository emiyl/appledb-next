'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { obfuscateNumber } from "@/utils/obfuscate";

type DeviceMapRelease = {
    datetime: string;
    depth: number;
};

type Device = {
    id: string;
    name: string;
    releaseDateString: string;
    categoryId: number;
    category: string;
};

type DeviceEntryProps = {
    deviceIds: string[];
};

const DeviceEntry: React.FC<DeviceEntryProps> = ({ deviceIds }) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (deviceIds.length === 0) {
            setDevices([]);
            setLoading(false);
            return;
        }
        const idsParam = deviceIds.join(",");
        fetch(`/api/device?device_id=${idsParam}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch device");
                return res.json();
            })
            .then((data: any | any[] | null) => {
                const formatReleaseDates = (deviceMapRelease: DeviceMapRelease[] = []) => {
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
                        .join(", ");
                };

                const normalizeDevice = (device: any): Device => ({
                    id: device.id,
                    name: device.name,
                    releaseDateString: formatReleaseDates(device.DeviceMapRelease),
                    category: device.DeviceLookupCategory?.name,
                    categoryId: device.category_id,
                    separator: "---------------",
                    ...device
                });

                if (Array.isArray(data)) {
                    setDevices(data.filter(Boolean).map(normalizeDevice));
                } else if (data) {
                    setDevices([normalizeDevice(data)]);
                } else {
                    setDevices([]);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [deviceIds]);

    if (loading) return <div>Loading devices...</div>;
    if (error) return <div>Error: {error}</div>;
    if (devices.length === 0) return <div>
        <h1>Error</h1>
        <p>No devices found.</p>
    </div>;

    const deviceName = devices.find(d => d.name)?.name || "Unknown Device";
    const deviceReleaseDate = devices.find(d => d.releaseDateString)?.releaseDateString || "Unknown release date";
    const deviceCategory = devices.find(d => d.category)?.category || "Unknown category";
    const deviceCategoryId = obfuscateNumber(devices.find(d => d.categoryId)?.categoryId || 0);

    return (
        <div>
            <div>
                <h1>{deviceName}</h1>
                <p>{deviceReleaseDate} — <Link href={`/device?category=${deviceCategoryId}`}>{deviceCategory}</Link></p>
                <pre>{ JSON.stringify(devices, null, 4) }</pre>
            </div>
        </div>
    );
};

export default DeviceEntry;