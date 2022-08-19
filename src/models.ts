import { Exception } from "./core";
export { Exception };

export class HandledException extends Exception
{
    public readonly exception: Exception;

    public constructor(exc: Exception, name = "HandledException")
    {
        super("The original exception has already been handled.");

        this.name = name;
        this.stack += `\nHandled ${exc.stack}`;

        this.exception = exc;
    }
}
