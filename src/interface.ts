export interface Store<T> {
    get(): T | undefined;
    set(t: T): void;
}
