import { decode as cborDecode, encode as cborEncode } from 'cbor-x';

export interface BytesFormatAdapter<T> {
    encode(data: T): Uint8Array;
    decode(data: Uint8Array): T;
}

export class CborAdapter<T> implements BytesFormatAdapter<T> {
    encode(data: T): Uint8Array {
        return cborEncode(data);
    }
    decode(data: Uint8Array): T {
        return cborDecode(data);
    }
}
