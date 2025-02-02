import { decodeBase85, encodeBase85 } from "@alttiri/base85";

export interface BytesUrlIO {
  encode(s: string): Uint8Array;
  decode(s: Uint8Array): string;
}

export class Base85UrlIO implements BytesUrlIO {
  encode(s: string): Uint8Array {
    return decodeBase85(s);
  }
  decode(s: Uint8Array): string {
    return encodeBase85(s);
  }
}
