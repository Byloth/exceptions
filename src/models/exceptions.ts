import { Exception } from "@byloth/core";

export class FatalErrorException extends Exception
{
    public constructor(message?: string, cause?: unknown, name = "FatalErrorException")
    {
        if (message === undefined)
        {
            message = "The routine has encountered an unrecoverable error and cannot continue as expected." +
                "Please, refresh the page and try again. If the problem persists, contact the support team.";
        }

        super(message, cause, name);
    }
}
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
            this.stack += `\n\nHas handled ${error.stack}`;
        }
        else
        {
            this.stack += `\n\nHas handled ${error}`;
        }

        this.handled = error;
    }
}
export class NotImplementedException extends Exception
{
    public constructor(message?: string, cause?: unknown, name = "NotImplementedException")
    {
        if (message === undefined)
        {
            message = "This feature is not implemented yet. Please, try again later.";
        }

        super(message, cause, name);
    }
}

export class FileNotFoundException extends Exception
{
    public constructor(message: string, cause?: unknown, name = "FileNotFoundException")
    {
        super(message, cause, name);
    }
}
export class NetworkException extends Exception
{
    public constructor(message: string, cause?: unknown, name = "NetworkException")
    {
        super(message, cause, name);
    }
}
export class PermissionException extends Exception
{
    public constructor(message: string, cause?: unknown, name = "PermissionException")
    {
        super(message, cause, name);
    }
}
export class ReferenceException extends Exception
{
    public constructor(message: string, cause?: unknown, name = "ReferenceException")
    {
        super(message, cause, name);
    }
}
export class RuntimeException extends Exception
{
    public constructor(message: string, cause?: unknown, name = "RuntimeException")
    {
        super(message, cause, name);
    }
}
export class TypeException extends Exception
{
    public constructor(message: string, cause?: unknown, name = "TypeException")
    {
        super(message, cause, name);
    }
}
export class ValueException extends Exception
{
    public constructor(message: string, cause?: unknown, name = "ValueException")
    {
        super(message, cause, name);
    }
}
