import { Exception } from "./core.js";

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
