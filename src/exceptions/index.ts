import { Exception } from "./core.js";

export class HandledException extends Exception
{
    public readonly handled: Exception;

    public constructor(exc: Exception, message?: string, name = "HandledException")
    {
        if (message === undefined)
        {
            message = "The original exception has already been handled successfully.";
        }

        super(message);

        this.name = name;
        this.stack += `\n\n[Handled]${exc.stack}`;

        this.handled = exc;
    }
}
