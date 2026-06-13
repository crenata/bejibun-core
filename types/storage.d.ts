import type {Stats} from "fs";

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
    /**
     * Determine whether a file exists.
     *
     * @param filepath The path to the file.
     * @returns True if the file exists; otherwise false.
     */
    exists(filepath: string): Promise<boolean>;

    /**
     * Determine whether a file is missing.
     *
     * @param filepath The path to the file.
     * @returns True if the file does not exist; otherwise false.
     */
    missing(filepath: string): Promise<boolean>;

    /**
     * Retrieve metadata for a file.
     *
     * @param filepath The path to the file.
     * @returns File metadata and statistics.
     */
    metadata(filepath: string): Promise<Stats | Bun.S3Stats>;

    /**
     * Get the file size in bytes.
     *
     * @param filepath The path to the file.
     * @returns The file size in bytes.
     */
    size(filepath: string): Promise<number>;

    /**
     * Get the file MIME type.
     *
     * @param filepath The path to the file.
     * @returns The detected MIME type.
     */
    mimeType(filepath: string): Promise<string>;

    /**
     * Get the file's last modification date.
     *
     * @param filepath The path to the file.
     * @returns The last modified timestamp.
     */
    lastModified(filepath: string): Promise<Date>;

    /**
     * Retrieve a file from storage.
     *
     * @param filepath The path to the file.
     * @returns The storage file instance.
     */
    get(filepath: string): Promise<Bun.BunFile | Bun.S3File>;

    /**
     * Store content at the given path.
     *
     * @param filepath The destination file path.
     * @param content The content to store.
     * @param options Additional storage options.
     */
    put(filepath: string, content: any, options?: StorageOptions): Promise<void>;

    /**
     * Copy a file to a new location.
     *
     * @param source The source file path.
     * @param destination The destination file path.
     * @param options Additional storage options.
     */
    copy(source: string, destination: string, options?: StorageOptions): Promise<void>;

    /**
     * Move a file to a new location.
     *
     * @param source The source file path.
     * @param destination The destination file path.
     * @param options Additional storage options.
     */
    move(source: string, destination: string, options?: StorageOptions): Promise<void>;

    /**
     * Delete a file from storage.
     *
     * @param filepath The path to the file.
     */
    delete(filepath: string): Promise<void>;
}