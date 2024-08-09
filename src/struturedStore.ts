import type { BytesFormatAdapter } from "./adapter";
import { UrlStore } from "./base_store";
import type { CompressionHandler } from "./compression";
import type { BytesUrlIO } from "./encoder";

/**
 * An url store using the the compressHandler to compress the adapted data 
 * from the bytesFormatAdapter which is the pushed to the bytesAdapter to put it in the url
 * 
 * data -> bytes -> compression -> bytesToString -> key in url
 */
export class StructuredUrlCompressedStore<Key extends string, T> extends UrlStore<T> {
    private readonly compressHandler: CompressionHandler;
    private readonly bytesAdapter: BytesUrlIO;
    private readonly bytesFormatAdapter: BytesFormatAdapter<T>;

    constructor(key: Key, formatAdapater: BytesFormatAdapter<T>, compressHandler: CompressionHandler, bytesAdapter: BytesUrlIO) {
        super(key);
        this.compressHandler = compressHandler;
        this.bytesFormatAdapter = formatAdapater;
        this.bytesAdapter = bytesAdapter;
    }

    protected adaptFromUrl(s: string): T {
        const decoded = this.bytesAdapter.encode(s);
        const decompressed = this.compressHandler.decompress(decoded);
        const result = this.bytesFormatAdapter.decode(decompressed);
        return result;

    }
    protected adaptToUrl(t: T): string {
        const result = this.bytesFormatAdapter.encode(t);
        const compressed = this.compressHandler.compress(result);
        return this.bytesAdapter.decode(compressed);
    }
}