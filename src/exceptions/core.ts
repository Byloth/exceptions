export class Exception extends Error
{
    public static FromUnknown(error: unknown): Exception
    {
        if (error instanceof Exception)
        {
            return error;
        }

        const exc = new Exception("");

        if (error instanceof Error)
        {
            exc.message = error.message;
            exc.stack = error.stack;
            exc.name = error.name;
        }
        else
        {
            exc.message = String(error);
        }

        return exc;
    }

    public constructor(message: string, cause?: unknown, name = "Exception")
    {
        super(message);

        this.name = name;

        if (cause)
        {
            if (cause instanceof Error)
            {
                this.stack += `\n\nCaused by ${cause.stack}`;
            }
            else
            {
                this.stack += `\n\nCaused by ${cause}`;
            }
        }
    }
}
