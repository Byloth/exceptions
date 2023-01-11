import { HandlerBuilder } from "./models.js";

import type { HandlerOptions } from "./models.js";
import type { ExceptionHandler } from "./types.js";

export function handle
    <E = unknown, R = void>(error: E, handler?: ExceptionHandler<E, R>, options?: Partial<HandlerOptions>): R | void
{
    const builder = new HandlerBuilder<never, R>(options);

    if (handler)
    {
        return builder.default(handler as ExceptionHandler<unknown, R>)
            .handle(error);
    }

    return builder.handle(error);
}
