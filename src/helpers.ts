import { HandlerBuilder } from "./models/index.js";
import type { ErrorHandler } from "./types.js";

export function handle<E, R>(error: E, handler?: ErrorHandler<E, R>): R | void
{
    const builder = new HandlerBuilder<never, R>();

    if (handler)
    {
        return builder
            .default(handler as ErrorHandler<unknown, R>)
            .handle(error);
    }

    return builder.handle(error);
}
