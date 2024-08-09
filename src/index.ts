import { CborAdapter, type BytesFormatAdapter } from "./adapter";
import { compressText, decompressText, zlibHandler, type CompressionHandler } from "./compression";
import { base85UrlIO, type BytesUrlIO } from "./encoder";
import { strFromU8, strToU8 } from 'fflate';

interface Store<T> {
    get(): T | undefined;
    set(t: T): void;
}

export abstract class UrlStore<T> implements Store<T> {
    readonly key: string;

    constructor(key: string) {
        this.key = key;
    }

    protected load(): string | undefined | null {
        const urlParams = new URLSearchParams(window.location.search);
        const d = urlParams.get(this.key);
        return d;
    }

    protected setInUrl(s: string) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set(this.key, s);
        const path = '?' + urlParams.toString();
        console.log('path length', path.length);
        window.history.pushState({ path }, '', path);
    }

    protected abstract adaptFromUrl(s: string): T;
    protected abstract adaptToUrl(t: T): string;

    empty() {
        this.setInUrl('');
    }

    get(): T | undefined {
        const d = this.load();
        if (d) {
            return this.adaptFromUrl(d);
        }
    }
    set(t: T): void {
        const encoded = this.adaptToUrl(t);
        this.setInUrl(encoded);
    }
}


export class JsonUrlCompressedStore<T> extends UrlStore<T> {
    protected adaptFromUrl(s: string): T {
        const decompressed = decompressText(strToU8(s, true));
        const parsed = JSON.parse(decompressed);
        return parsed as T;
    }
    protected adaptToUrl(d: T): string {
        const data = JSON.stringify(d);
        const compressed = compressText(data);
        const encoded = strFromU8(compressed, true);
        return encoded;
    }
}

export class JsonUrlStore<T> extends UrlStore<T> {
    protected adaptFromUrl(s: string): T {
        return JSON.parse(decodeURIComponent(atob(s)));
    }
    protected adaptToUrl(d: T): string {
        return btoa(encodeURIComponent(JSON.stringify(d)))
    }
}

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

export function makeCborStore<Key extends string, T>(key: Key) {
    return new StructuredUrlCompressedStore<Key, T>(key, new CborAdapter(), zlibHandler, base85UrlIO);
}