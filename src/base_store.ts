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
        const path = '?' + urlParams.toString();
        console.log('path length', path.length);
        window.history.pushState({ path }, '', path);
    }

    protected abstract adaptFromUrl(s: string): T;
    protected abstract adaptToUrl(t: T): string;

    drop() {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete(this.key);
        const path = '?' + urlParams.toString();
        window.history.pushState({ path }, '', path);
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
export class JsonUrlStore<T> extends UrlStore<T> {
    protected adaptFromUrl(s: string): T {
        return JSON.parse(decodeURIComponent(atob(s)));
    }
    protected adaptToUrl(d: T): string {
        return btoa(encodeURIComponent(JSON.stringify(d)))
    }
}