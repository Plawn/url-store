import * as fflate from 'fflate';

function compress(data: Uint8Array) {
    const notSoMassive = fflate.zlibSync(data, { level: 9 });
    return notSoMassive;
}

export function compressText(data: string) {
    const buf = fflate.strToU8(data);
    return compress(buf);
}

function decompress(data: Uint8Array) {
    const massiveAgain = fflate.unzlibSync(data);
    return massiveAgain;
}

export function decompressText(data: Uint8Array) {
    const res = decompress(data);
    const buf = fflate.strFromU8(res);
    return buf;

}



export interface CompressionHandler {
    compress(data: Uint8Array): Uint8Array;
    decompress(data: Uint8Array): Uint8Array;
}

export class ZlibHanlder implements CompressionHandler {
    compress(data: Uint8Array) {
        return fflate.zlibSync(data, { level: 9 });
    }

    decompress(data: Uint8Array) {
        return fflate.unzlibSync(data);
    }
}


export const zlibHandler = new ZlibHanlder();
