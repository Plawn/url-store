import * as fflate from "fflate";

export interface CompressionHandler {
  compress(data: Uint8Array): Uint8Array;
  decompress(data: Uint8Array): Uint8Array;
}

export class ZlibHandler implements CompressionHandler {
  compress(data: Uint8Array) {
    return fflate.zlibSync(data, { level: 9 });
  }

  decompress(data: Uint8Array) {
    return fflate.unzlibSync(data);
  }
}
