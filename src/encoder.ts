import { encodeBase85, decodeBase85 } from "@alttiri/base85";


export interface BytesUrlIO {
    encode(s: string): Uint8Array;
    decode(s: Uint8Array): string;
}

class Base85UrlIO implements BytesUrlIO {
    encode(s: string): Uint8Array {
        return decodeBase85(s);
    }
    decode(s: Uint8Array): string {
        return encodeBase85(s);
    }
}

export const base85UrlIO = new Base85UrlIO();