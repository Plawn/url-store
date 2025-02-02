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
export class StructuredUrlCompressedStore<Key extends string, T extends string>
  extends UrlStore<T> {
  private readonly formatAdapter: BytesFormatAdapter<T>;
  private readonly compressHandler: CompressionHandler;
  private readonly bytesAdapter: BytesUrlIO;

  constructor(
    key: Key,
    formatAdapater: BytesFormatAdapter<T>,
    compressHandler: CompressionHandler,
    bytesAdapter: BytesUrlIO,
  ) {
    super(key);
    this.compressHandler = compressHandler;
    this.formatAdapter = formatAdapater;
    this.bytesAdapter = bytesAdapter;
  }

  protected adaptFromUrl(s: string): T {
    const decoded = this.bytesAdapter.encode(s);
    const decompressed = this.compressHandler.decompress(decoded);
    const result = this.formatAdapter.decode(decompressed);
    return result;
  }
  protected adaptToUrl(t: T): string {
    const result = this.formatAdapter.encode(t);
    const compressed = this.compressHandler.compress(result);
    return this.bytesAdapter.decode(compressed);
  }
}
