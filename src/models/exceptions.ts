import { Exception } from "@byloth/core";

export class HandledException<T = unknown> extends Exception
{
    public readonly handled: T;

    public constructor(error: T, message?: string, name = "HandledException")
    {
        if (message === undefined)
        {
            if (error instanceof Exception)
            {
                message = "The exception has been handled properly.";
            }
            else
            {
                message = "The error has been handled properly.";
            }
        }

        super(message);

        this.name = name;
        if (error instanceof Error)
        {
            this.stack += `\n\n[Handled]${error.stack}`;
        }
        else
        {
            this.stack += `\n\n[Handled]${error}`;
        }

        this.handled = error;
    }
}
