import { decode as cborDecode, encode as cborEncode } from "cbor-x";

export interface BytesFormatAdapter<T> {
  encode(data: T): Uint8Array;
  decode(data: Uint8Array): T;
}

export class CborAdapter<T> implements BytesFormatAdapter<T> {
  encode(data: T): Uint8Array {
    // Buffer extends Uint8Array -> type error ?
    return cborEncode(data) as any as Uint8Array;
  }
  decode(data: Uint8Array): T {
    return cborDecode(data);
  }
}
