import { decodeBase85, encodeBase85 } from "@alttiri/base85";

export interface BytesUrlIO {
  decode(s: string): Uint8Array;
  encode(s: Uint8Array): string;
}

export class Base85UrlIO implements BytesUrlIO {
  decode(s: string): Uint8Array {
    return decodeBase85(s);
  }
  encode(s: Uint8Array): string {
    return encodeBase85(s);
  }
}
