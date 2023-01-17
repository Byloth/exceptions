/* eslint-disable @typescript-eslint/no-explicit-any */

export type Awaitable<T> = T | PromiseLike<T>;
export type Constructor<T = any, P = any> = new (...args: P[]) => T;
export type ErrorHandler<E = unknown, R = void> = (error: E) => R;

export interface ExceptionMap<E extends Error, R>
{
    type: Constructor<E>;
    handler: ErrorHandler<E, R>;
}
