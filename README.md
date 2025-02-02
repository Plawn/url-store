# Url Store

Allows to store arbitrary data in the url in the browser

## Basic example

```ts
import { makeDefaultStore } from "@petite-org/url-store";

// This allows us to store data in the url
// on the data key
const store = makeDefaultStore<string, Record<string, any>>("data");

// The data should be serialyzable from the adapter layer
// the base adapter Layer is the CborAdapter
// it allows us to store any JSON and transform it to bytes
const data = {
  "hello": "i'm a value",
};

// Data is here transformed from "JS object"
// to CborRepresentation then is compressed using zlib
// the result is encoded to string using b85
store.set(data);
```

## Adavanced example

```ts
import {
  base85UrlIO,
  BytesFormatAdapter,
  defaultCompressionHandler,
  makeDefaultStore,
} from "@petite-org/url-store";

// allows to store Uint8Array in the URL directly
export class IdentityAdapter implements BytesFormatAdapter<Uint8Array> {
  encode(data: Uint8Array): Uint8Array {
    return data;
  }
  decode(data: Uint8Array): Uint8Array {
    return data;
  }
}

const store = new StructuredUrlCompressedStore<string, Uint8Array>(
  key,
  new IdentityAdapter(),
  // can be reused for each store
  defaultCompressionHandler,
  // can be reused for each store
  base85UrlIO,
);

// The data should be serialyzable from the adapter layer
const data = new Uint8Array();

// Data is here transformed from "JS object"
// to CborRepresentation then is compressed using zlib
// the result is encoded to string using b85
store.set(data);
```
