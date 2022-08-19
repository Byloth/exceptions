/* eslint-disable @typescript-eslint/ban-ts-comment */

import { HandledException } from "./models";
import { Constructor, ExceptionMap, MaybePromise } from "./types";

export interface HandleOptions
{
    rethrowHandled?: boolean;
}
export const handle = (exception: unknown, options: HandleOptions = { }) =>
{
    const map: ExceptionMap<Error>[] = [];

    const _nodeFactory = () =>
    {
        const errorTypes: Array<Constructor<Error>> = [];

        const _onFactory = <R extends Error>() =>
        {
            return <T extends Error>(errorType: Constructor<T>) =>
            {
                // @ts-ignore
                if (errorType === HandledException)
                {
                    options.rethrowHandled = true;
                }

                errorTypes.push(errorType);

                return {
                    on: _onFactory<T | R>(),
                    do: (handler: (exc: T | R) => void) =>
                    {
                        for (const errorType of errorTypes)
                        {
                            map.push({
                                type: errorType,

                                // @ts-ignore
                                handler: handler
                            });
                        }

                        return _nodeFactory();
                    }
                };
            };
        };
        const _else = () =>
        {
            return {
                do: (handler: (exc: unknown) => MaybePromise<void>) =>
                {
                    if ((exception instanceof HandledException) && (!(options?.rethrowHandled)))
                    {
                        // eslint-disable-next-line no-console
                        return console.warn(exception);
                    }

                    for (const match of map)
                    {
                        if (exception instanceof match.type)
                        {
                            return match.handler(exception);
                        }
                    }

                    return handler(exception);
                }
            };
        };

        return {
            on: _onFactory<never>(),
            else: _else,
            end: () => _else()
                .do((exc) => { throw exc; })
        };
    };

    return {
        on: _nodeFactory().on,
        do: (handler: (exc: unknown) => MaybePromise<void>) =>
        {
            if (options?.rethrowHandled)
            {
                // eslint-disable-next-line no-console
                console.warn(
                    "Handling an exception this way is redundant and causes some execution overhead.\n" +
                    "Did you miss using the `on` method to define the exception type to handle?"
                );
            }
            else if (exception instanceof HandledException)
            {
                // eslint-disable-next-line no-console
                return console.warn(exception);
            }

            return handler(exception);
        }
    };
};
