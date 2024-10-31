import type { Constructor } from "@byloth/core";

import { HandlerBuilder } from "./models/index.js";
import type { ErrorHandler } from "./types.js";

export function expect<T, E extends Error, R = void, D = void>(
    error: T,
    errorType: Constructor<E>,
    errorHandler: ErrorHandler<E, R>,
    defaultHandler?: ErrorHandler<unknown, D>): R | D | void;
export function expect<T, E extends Error, R = void, D = void>(
    error: T,
    errorTypes: Constructor<E>[],
    errorHandler: ErrorHandler<E, R>,
    defaultHandler?: ErrorHandler<unknown, D>): R | D | void;
export function expect<T, E extends Error, R = void, D = void>(
    error: T,
    errorTypes: Constructor<E> | Constructor<E>[],
    errorHandler: ErrorHandler<E, R>,
    defaultHandler?: ErrorHandler<unknown, D>): R | D | void;
export function expect<T, E extends Error, R = void, D = void>(
    error: T,
    errorTypes: Constructor<E> | Constructor<E>[],
    errorHandler: ErrorHandler<E, R>,
    defaultHandler?: ErrorHandler<unknown, D>): R | D | void
{
    const builder = new HandlerBuilder<R, D>();

    if (!(errorHandler))
    {
        errorHandler = ((exc: E): void => { }) as ErrorHandler<E, R>;
    }

    builder.on(errorTypes, errorHandler);

    if (defaultHandler) { builder.default(defaultHandler); }

    return builder.handle(error);
}

/**
 * expect(error).toBe(MyError)
 *     .then(() => { })
 *     .catch(() => { });
 */

export function ignore<T, E extends Error, R = void, D = void>(error: T, errorType: Constructor<E>)
    : R | D | void;
export function ignore<T, E extends Error, R = void, D = void>(error: T, errorTypes: Constructor<E>[])
    : R | D | void;
export function ignore<T, E extends Error, R = void, D = void>(error: T, errorTypes: Constructor<E> | Constructor<E>[])
    : R | D | void;
export function ignore<T, E extends Error, R = void, D = void>(error: T, errorTypes: Constructor<E> | Constructor<E>[])
    : R | D | void
{
    const builder = new HandlerBuilder<R, D>();

    builder.ignore(errorTypes);

    return builder.handle(error);
}

/**
 * ignore(error).toBe(MyError)
 *     .then(() => { })
 *     .catch(() => { });
 */
