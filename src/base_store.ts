import type { Store } from "./interface";

export abstract class UrlStore<T> implements Store<T> {
  readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  protected load(): string | undefined | null {
    const urlParams = new URLSearchParams(window.location.search);
    const d = urlParams.get(this.key);
    return d;
  }

  protected setInUrl(s: string) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(this.key, s);
    const path = "?" + urlParams.toString();
    window.history.pushState({ path }, "", path);
  }

  protected abstract adaptFromUrl(s: string): T;
  protected abstract adaptToUrl(t: T): string;

  drop() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(this.key);
    const path = "?" + urlParams.toString();
    window.history.pushState({ path }, "", path);
  }

  get(): T | undefined {
    const d = this.load();
    if (d) {
      return this.adaptFromUrl(d);
    }
  }
  set(t: T): void {
    const encoded = this.adaptToUrl(t);
    this.setInUrl(encoded);
  }
}

export abstract class FlatUrlStore<T> implements Store<T> {
  readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  protected load(): { [key: string]: string } | undefined | null {
    const urlParams = new URLSearchParams(window.location.search);
    const res: { [key: string]: string } = {};
    urlParams.forEach(([value, key]) => {
      res[key] = value;
    });
    return res;
  }

  protected setInUrl(items: { [key: string]: string }) {
    const urlParams = new URLSearchParams(window.location.search);
    Object.entries(items).forEach(([key, value]) => {
      urlParams.set(`${this.key}.${key}`, value);
    });
    const path = "?" + urlParams.toString();
    window.history.pushState({ path }, "", path);
  }

  protected abstract adaptFromUrl(s: { [key: string]: string }): T;
  protected abstract adaptToUrl(t: T): { [key: string]: string };

  drop() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(this.key);
    const path = "?" + urlParams.toString();
    window.history.pushState({ path }, "", path);
  }

  get(): T | undefined {
    const d = this.load();
    if (d) {
      return this.adaptFromUrl(d);
    }
  }
  set(t: T): void {
    const encoded = this.adaptToUrl(t);
    this.setInUrl(encoded);
  }
}

/**
 * Simplest store, using no compression
 */
export class JsonB64UrlStore<T> extends UrlStore<T> {
  protected adaptFromUrl(s: string): T {
    return JSON.parse(decodeURIComponent(atob(s)));
  }
  protected adaptToUrl(d: T): string {
    return btoa(encodeURIComponent(JSON.stringify(d)));
  }
}

/**
 * Simplest store, using no compression
 */
export class JsonUrlStore<T> extends UrlStore<T> {
  protected adaptFromUrl(s: string): T {
    return JSON.parse(decodeURIComponent(s));
  }
  protected adaptToUrl(d: T): string {
    return encodeURIComponent(JSON.stringify(d));
  }
}


/**
 * Simplest store, using no compression
 */
export class FlatJsonUrlStore<T extends Object> extends FlatUrlStore<T> {
  protected adaptFromUrl(s: { [key: string]: string }): T {
    const res = {} as T; // TODO: should add validation one day
    // return JSON.parse(decodeURIComponent(atob(s)));
    Object.entries(s).forEach(([key, value]) => {
      // @ts-ignore -> the keys are already filtered
      res[key] = decodeURIComponent(value);
    });
    return res;
  }
  protected adaptToUrl(d: T): { [key: string]: string } {
    const res = {} as { [key: string]: string }; // TODO: should add validation one day
    // return JSON.parse(decodeURIComponent(atob(s)));
    Object.entries(d).forEach(([key, value]) => {
      res[key] = encodeURIComponent(value);
    });
    return res;
  }
}

