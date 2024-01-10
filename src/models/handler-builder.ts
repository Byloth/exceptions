/* eslint-disable @typescript-eslint/no-explicit-any */

import { Exception } from "@byloth/core";
import type { Constructor } from "@byloth/core";

import { HandledException } from "./exceptions.js";

import type { ErrorHandler, ExceptionMap } from "../types.js";

export interface HandlerOptions
{
    rethrowHandled: boolean;
}

export default class HandlerBuilder<T = never, D = void>
{
    public static get DefaultOpts(): HandlerOptions
    {
        return { rethrowHandled: false };
    }

    protected readonly _options: HandlerOptions;
    protected readonly _handlers: ExceptionMap<Error, unknown>[];

    protected _default: ErrorHandler<unknown, unknown>;
    protected _set: boolean;

    public constructor(options: Partial<HandlerOptions> = { })
    {
        this._options = { ...HandlerBuilder.DefaultOpts, ...options };
        this._handlers = [];

        this._default = (exc: unknown) => { throw exc; };
        this._set = false;
    }

    public on<E extends Error, R>(errorType: Constructor<E>, errorHandler: ErrorHandler<E, R>)
        : HandlerBuilder<T | R, D>;
    public on<E extends Error, R>(errorTypes: Constructor<E>[], errorHandler: ErrorHandler<E, R>)
        : HandlerBuilder<T | R, D>;
    public on<E extends Error, R>(errorTypes: Constructor<E> | Constructor<E>[], errorHandler: ErrorHandler<E, R>)
        : HandlerBuilder<T | R, D>;
    public on<E extends Error, R>(errorTypes: Constructor<E> | Constructor<E>[], errorHandler: ErrorHandler<E, R>)
        : HandlerBuilder<T | R, D>
    {
        if (this._set)
        {
            throw new Exception("The default handler has already been set. " +
                                "You cannot specify a new exception type to handle" +
                                " after the default handler has been set.");
        }

        if (Array.isArray(errorTypes))
        {
            errorTypes.forEach((errorType) => this._handlers.push({
                type: errorType,
                handler: errorHandler as ErrorHandler<Error, unknown>
            }));
        }
        else
        {
            this._handlers.push({
                type: errorTypes,
                handler: errorHandler as ErrorHandler<Error, unknown>
            });
        }

        return this;
    }

    public ignore<E extends Error>(errorType: Constructor<E>): HandlerBuilder<T | void, D>;
    public ignore<E extends Error>(errorTypes: Constructor<E>[]): HandlerBuilder<T | void, D>;
    public ignore<E extends Error>(errorTypes: Constructor<E> | Constructor<E>[]): HandlerBuilder<T | void, D>
    {
        if (this._set)
        {
            throw new Exception("The default handler has already been set. " +
                                "You cannot specify a new exception type to handle" +
                                " after the default handler has been set.");
        }

        if (Array.isArray(errorTypes))
        {
            errorTypes.forEach((errorType) => this._handlers.push({
                type: errorType,
                handler: () => { }
            }));
        }
        else
        {
            this._handlers.push({
                type: errorTypes,
                handler: () => { }
            });
        }

        return this;
    }

    public default<R>(errorHandler: ErrorHandler<unknown, R>): HandlerBuilder<T, R>
    {
        if (this._set)
        {
            throw new Exception("The default handler has already been set. " +
                                "You cannot specify more than one default handler.");
        }

        this._default = errorHandler;
        this._set = true;

        return (this as unknown) as HandlerBuilder<T, R>;
    }

    public handle<E>(error: E): T | D | void
    {
        if ((this._options.rethrowHandled) && (this._handlers.length === 0))
        {
            // eslint-disable-next-line no-console
            console.warn("Handling an exception this way is redundant" +
                         " and causes some execution overhead.\n" +
                         "Did you maybe miss using the `on` method" +
                         " to define the exception type to handle?");

            return this._default(error) as D;
        }

        for (const { type, handler } of this._handlers)
        {
            if (error instanceof type)
            {
                return handler(error) as T;
            }
        }

        if (error instanceof HandledException)
        {
            // eslint-disable-next-line no-console
            return console.warn(error);
        }

        return this._default(error) as D;
    }
}
