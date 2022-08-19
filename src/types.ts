// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T, P = any> = new (...args: P[]) => T;
export type MaybePromise<T> = T | Promise<T>;

export interface ExceptionMap<T extends Error>
{
    type: Constructor<T>;
    handler: (exc: T) => void;
}
