export const VERSION = "2.2.1";

export { Exception } from "@byloth/core";

export {
    FatalErrorException,
    FileNotFoundException,
    HandledException,
    HandlerBuilder,
    NetworkException,
    NotImplementedException,
    PermissionException,
    ReferenceException,
    RuntimeException,
    TypeException,
    ValueException

} from "./models/index.js";

export { expect, handle } from "./helpers.js";

export type { HandlerOptions } from "./models/handler-builder.js";
export type { ErrorHandler } from "./types.js";
