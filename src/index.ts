export { Exception } from "./exceptions/core.js";
export { HandledException } from "./exceptions/index.js";
export { FatalErrorException, NotImplementedException } from "./exceptions/types.js";
export {
    FileNotFoundException,
    NetworkException,
    PermissionException,
    ReferenceException,
    RuntimeException,
    TypeException,
    ValueException,

} from "./exceptions/types.js";

export { HandlerBuilder } from "./models.js";

export { handle } from "./helpers.js";

export const VERSION = "2.1.0";

export type { HandlerOptions } from "./models.js";
export type { ErrorHandler } from "./types.js";
