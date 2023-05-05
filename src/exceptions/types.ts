import { Exception } from "./core.js";

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

export class NetworkException extends Exception
{
    public constructor(message: string, cause?: unknown, name = "NetworkException")
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
export class ValueException extends Exception
{
    public constructor(message: string, cause?: unknown, name = "ValueException")
    {
        super(message, cause, name);
    }
}
