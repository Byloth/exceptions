export type Awaitable<T> = T | PromiseLike<T>;
export type Constructor<T = any, P = any> = new (...args: P[]) => T;
export type ExceptionHandler<E = unknown, R = void> = (exc: E) => R;

export interface ExceptionMap<E extends Error, R>
{
    type: Constructor<E>;
    handler: ExceptionHandler<E, R>;
}
