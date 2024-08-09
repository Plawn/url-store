import { CborAdapter, type BytesFormatAdapter } from "./adapter";
import { UrlStore } from "./base_store";
import { zlibHandler, type CompressionHandler } from "./compression";
import { base85UrlIO, type BytesUrlIO } from "./encoder";
import { StructuredUrlCompressedStore } from "./struturedStore";

export type {
    BytesUrlIO, CompressionHandler, BytesFormatAdapter
}
export  {
    StructuredUrlCompressedStore, UrlStore
}

/**
 * Creates as store using cbor as the format encoding and compressed using fflate zlib
 * Encoded in the url in base85
 * @param key key of the store in the url
 * @returns 
 */
export function makeCborStore<Key extends string, T>(key: Key) {
    return new StructuredUrlCompressedStore<Key, T>(key, new CborAdapter(), zlibHandler, base85UrlIO);
}