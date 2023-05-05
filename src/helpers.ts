import { HandlerBuilder } from "./models.js";

import type { HandlerOptions } from "./models.js";
import type { ErrorHandler } from "./types.js";

export function handle<E = unknown, R = void>
    (error: E, handler?: ErrorHandler<E, R>, options?: Partial<HandlerOptions>): R | void
{
    const builder = new HandlerBuilder<never, R>(options);

    if (handler)
    {
        return builder.default(handler as ErrorHandler<unknown, R>)
            .handle(error);
    }

    return builder.handle(error);
}
