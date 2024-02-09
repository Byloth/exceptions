/* eslint-disable @typescript-eslint/no-explicit-any */

import { Exception } from "@byloth/core";
import type { Constructor } from "@byloth/core";

import { HandledException } from "./exceptions.js";

import type { ErrorHandler, ExceptionMap } from "../types.js";

export interface HandlerOptions
{
    rethrowHandled: boolean;
}

export default class HandlerBuilder<T = never, D = never, C = never>
{
    public static get DefaultOpts(): HandlerOptions
    {
        return { rethrowHandled: false };
    }

    protected readonly _options: HandlerOptions;
    protected readonly _handlers: ExceptionMap<Error, unknown>[];

    protected _catch: ErrorHandler<unknown, C>;
    protected _catchSet: boolean;

    protected _default: ErrorHandler<unknown, D>;
    protected _defaultSet: boolean;

    public constructor(options: Partial<HandlerOptions> = { })
    {
        this._options = { ...HandlerBuilder.DefaultOpts, ...options };
        this._handlers = [];

        this._catch = (error: unknown) => { throw error; };
        this._catchSet = false;

        this._default = (error: unknown) => { throw error; };
        this._defaultSet = false;
    }

    public on<E extends Error, R>(errorType: Constructor<E>, errorHandler: ErrorHandler<E, R>)
        : HandlerBuilder<T | R, D, C>;
    public on<E extends Error, R>(errorTypes: Constructor<E>[], errorHandler: ErrorHandler<E, R>)
        : HandlerBuilder<T | R, D, C>;
    public on<E extends Error, R>(errorTypes: Constructor<E> | Constructor<E>[], errorHandler: ErrorHandler<E, R>)
        : HandlerBuilder<T | R, D, C>;
    public on<E extends Error, R>(errorTypes: Constructor<E> | Constructor<E>[], errorHandler: ErrorHandler<E, R>)
        : HandlerBuilder<T | R, D, C>
    {
        if (this._catchSet)
        {
            throw new Exception("The catch handler has already been set. " +
                                "You cannot specify a new exception type to handle" +
                                " after the catch handler has been set.");
        }
        if (this._defaultSet)
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

    public ignore<E extends Error>(errorType: Constructor<E>): HandlerBuilder<T | void, D, C>;
    public ignore<E extends Error>(errorTypes: Constructor<E>[]): HandlerBuilder<T | void, D, C>;
    public ignore<E extends Error>(errorTypes: Constructor<E> | Constructor<E>[]): HandlerBuilder<T | void, D, C>
    {
        if (this._catchSet)
        {
            throw new Exception("The catch handler has already been set. " +
                                "You cannot ignore an exception type" +
                                " after the catch handler has been set.");
        }
        if (this._defaultSet)
        {
            throw new Exception("The default handler has already been set. " +
                                "You cannot ignore an exception type" +
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

    public catch<R>(errorHandler: ErrorHandler<unknown, R>): HandlerBuilder<T, D, R>
    {
        if (this._defaultSet)
        {
            throw new Exception("The default handler has already been set. " +
                                "You cannot specify a catch handler" +
                                " after the default handler has been set.");
        }

        this._catch = (errorHandler as unknown) as ErrorHandler<unknown, C>;
        this._catchSet = true;

        return (this as unknown) as HandlerBuilder<T, D, R>;
    }
    public default<R>(errorHandler: ErrorHandler<unknown, R>): HandlerBuilder<T, R, C>
    {
        if (this._catchSet)
        {
            throw new Exception("The catch handler has already been set. " +
                                "You cannot specify a default handler" +
                                " after the catch handler has been set.");
        }
        if (this._defaultSet)
        {
            throw new Exception("The default handler has already been set. " +
                                "You cannot specify more than one default handler.");
        }

        this._default = (errorHandler as unknown) as ErrorHandler<unknown, D>;
        this._defaultSet = true;

        return (this as unknown) as HandlerBuilder<T, R, C>;
    }

    public handle(error: unknown): T | D | C | void
    {
        try
        {
            if ((this._options.rethrowHandled) && (this._handlers.length === 0))
            {
                // eslint-disable-next-line no-console
                console.warn("Handling an exception this way is redundant" +
                            " and causes some execution overhead.\n" +
                            "Did you maybe miss using the `on` method" +
                            " to define the exception type to handle?");

                return this._default(error);
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

            return this._default(error);
        }
        catch (e)
        {
            if (e instanceof Error)
            {
                if (error instanceof Error)
                {
                    e.stack += `\n\nHas occurred while trying to handle ${error.stack}`;
                }
                else
                {
                    e.stack += `\n\nHas occurred while trying to handle ${error}`;
                }
            }
            else
            {
                /* eslint-disable no-ex-assign */

                if (error instanceof Error)
                {
                    e = `${e}\n\nHas occurred while trying to handle ${error.stack}`;
                }
                else
                {
                    e = `${e}\n\nHas occurred while trying to handle ${error}`;
                }
            }

            return this._catch(e);
        }
    }
}
