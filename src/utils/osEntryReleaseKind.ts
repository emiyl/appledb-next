import { OsEntry } from '@/types';
import { OsEntryReleaseKind } from '@/types/OsEntryReleaseKind';
import styles from "@/styles/OsEntryListFilter.module.scss";

export function getOsEntryReleaseKinds(entry: OsEntry): OsEntryReleaseKind[] {
    const kinds: OsEntryReleaseKind[] = [];
    if (entry.is_release) {
        kinds.push(OsEntryReleaseKind.Release);
    }
    if (entry.is_beta) {
        kinds.push(OsEntryReleaseKind.Beta);
    }
    if (entry.is_rc) {
        kinds.push(OsEntryReleaseKind.Beta);
    }
    if (entry.is_internal) {
        kinds.push(OsEntryReleaseKind.Internal);
    }
    if (entry.is_sdk) {
        kinds.push(OsEntryReleaseKind.SDK);
    }
    if (entry.is_simulator) {
        kinds.push(OsEntryReleaseKind.Simulator);
    }
    return kinds;
}
  
export function getOsEntryReleaseKindLabel(kind: OsEntryReleaseKind): string {
    switch (kind) {
        case OsEntryReleaseKind.Release:
            return "Release";
        case OsEntryReleaseKind.Beta:
            return "Beta";
        case OsEntryReleaseKind.Internal:
            return "Internal";
        case OsEntryReleaseKind.SDK:
            return "SDK";
        case OsEntryReleaseKind.Simulator:
            return "Simulator";
    }
}

export function getOsEntryReleaseKindClass(kind: OsEntryReleaseKind): string {
    switch (kind) {
        case OsEntryReleaseKind.Release:
            return styles.release;
        case OsEntryReleaseKind.Beta:
            return styles.beta;
        case OsEntryReleaseKind.Internal:
            return styles.internal;
        case OsEntryReleaseKind.SDK:
            return styles.sdk;
        case OsEntryReleaseKind.Simulator:
            return styles.simulator;
    }
}