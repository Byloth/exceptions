import { Exception } from "./core.js";

export class HandledException extends Exception
{
    public readonly handled: Exception;

    public constructor(exc: Exception, name = "HandledException")
    {
        super("The original exception has already been handled successfully.");

        this.name = name;
        this.stack += `\n\nHandled ${exc.stack}`;

        this.handled = exc;
    }
}
