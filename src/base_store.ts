import type { Store } from "./interface";

// TODO: implement in top of the flat store, execept it's only one key
export abstract class UrlStore<T> implements Store<T> {
  readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  protected load(searchParams?: string): string | undefined | null {
    const urlParams = new URLSearchParams(
      searchParams || window.location.search,
    );
    const d = urlParams.get(this.key);
    return d;
  }

  /**
   * If we set push to false, then the caller is responsible for updating the url
   * @param s
   * @param push
   * @returns
   */
  protected setInUrl(s: string, push: boolean = true): string {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(this.key, s);
    const searchParams = "?" + urlParams.toString();
    if (push) {
      window.history.pushState({ path: searchParams }, "", searchParams);
    }
    return searchParams;
  }

  protected abstract adaptFromUrl(s: string): T;
  protected abstract adaptToUrl(t: T): string;

  drop() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(this.key);
    const path = "?" + urlParams.toString();
    window.history.pushState({ path }, "", path);
  }

  /**
   * @param searchParams optional current params to parse -> in case we want reactive usage
   * @returns
   */
  get(searchParams?: string): T | undefined {
    const d = this.load(searchParams);
    if (d) {
      return this.adaptFromUrl(d);
    }
  }
  /**
   * If we set push to false, then the caller is responsible for updating the url
   * @param t
   * @param push
   */
  set(t: T, push = true): string {
    const encoded = this.adaptToUrl(t);
    return this.setInUrl(encoded, push);
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
    return path;
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
  set(t: T): string {
    const encoded = this.adaptToUrl(t);
    return this.setInUrl(encoded);
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
