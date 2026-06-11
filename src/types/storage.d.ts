export type StorageDisk = {
    driver: string;
    [key: string]: unknown;
};

export type StorageOptions = {
    mode?: number;
    createPath?: boolean;
    acl?:
        | "private"
        | "public-read"
        | "public-read-write"
        | "aws-exec-read"
        | "authenticated-read"
        | "bucket-owner-read"
        | "bucket-owner-full-control"
        | "log-delivery-write";
    bucket?: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    sessionToken?: string;
    endpoint?: string;
    virtualHostedStyle?: boolean;
    partSize?: number;
    queueSize?: number;
    retry?: number;
    type?: string;
    contentDisposition?: string | undefined;
    storageClass?:
        | "STANDARD"
        | "DEEP_ARCHIVE"
        | "EXPRESS_ONEZONE"
        | "GLACIER"
        | "GLACIER_IR"
        | "INTELLIGENT_TIERING"
        | "ONEZONE_IA"
        | "OUTPOSTS"
        | "REDUCED_REDUNDANCY"
        | "SNOW"
        | "STANDARD_IA";
    requestPayer?: boolean;
    highWaterMark?: number;
};

export interface StorageDriver {
    exists(filepath: string): Promise<boolean>;

    missing(filepath: string): Promise<boolean>;

    get(filepath: string): Promise<Bun.BunFile | Bun.S3File>;

    put(filepath: string, content: any, options?: StorageOptions): Promise<void>;

    copy(source: string, destination: string, options?: StorageOptions): Promise<void>;

    move(source: string, destination: string, options?: StorageOptions): Promise<void>;

    delete(filepath: string): Promise<void>;
}