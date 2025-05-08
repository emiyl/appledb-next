export type OsEntry = {
    id: number;
    version: string;
    build: string;
    release_datetime: Date;
    release_datetime_depth: number;
    is_release: boolean;
    is_beta: boolean;
    is_rc: boolean;
    is_rsr: boolean;
    is_internal: boolean;
    is_sdk: boolean;
    is_simulator: boolean;
    OsLookupName: {
        name: string;
    };
};