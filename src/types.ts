/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Constructor } from "@byloth/core";

export type ErrorHandler<E = unknown, R = void> = (error: E) => R;

export interface ExceptionMap<E extends Error, R>
{
    type: Constructor<E>;
    handler: ErrorHandler<E, R>;
}
