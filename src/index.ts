import { type BytesFormatAdapter, CborAdapter } from "./adapter";
import { type CompressionHandler, ZlibHandler } from "./compression";
import { Base85UrlIO, type BytesUrlIO } from "./encoder";
import { StructuredUrlCompressedStore } from "./struturedStore";
export { JsonUrlStore, UrlStore } from "./base_store";
export type { BytesFormatAdapter, BytesUrlIO, CompressionHandler };
export { StructuredUrlCompressedStore };

export const defaultCompressionHandler = new ZlibHandler();
export const base85UrlIO = new Base85UrlIO();

/**
 * Creates as store using cbor as the format encoding and compressed using fflate zlib
 * Encoded in the url in base85
 * @param key key of the store in the url
 * @returns
 */
export function makeDefaultStore<Key extends string, T>(key: Key) {
  return new StructuredUrlCompressedStore<Key, T>(
    key,
    new CborAdapter(),
    // can be reused for each store
    defaultCompressionHandler,
    // can be reused for each store
    base85UrlIO,
  );
}
