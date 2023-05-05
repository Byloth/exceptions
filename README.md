# Exceptions ❌

[![NPM release](https://github.com/Byloth/exceptions/actions/workflows/release-npm.yml/badge.svg)](https://github.com/Byloth/exceptions/actions/workflows/release-npm.yml)
[![GPR release](https://github.com/Byloth/exceptions/actions/workflows/release-gpr.yml/badge.svg)](https://github.com/Byloth/exceptions/actions/workflows/release-gpr.yml)

Handle exceptions with ease, create better stacktraces and manage everything in the right place.

## Summary

- [Installation](#installation)
- [Main concepts](#main-concepts)
    - [Chained exceptions](#chained-exceptions)
    - [Typed exceptions](#typed-exceptions)
    - [Handled exceptions](#handled-exceptions)

## Installation

```sh
npm install --save-dev @byloth/exceptions
```

## Main concepts

### Chained exceptions

This library allows you to create a chain of exceptions -just like you can already do with other programming languages-
so you can easily know which error caused which exception, where it was thrown and what was the original cause.

At the same time, you can also provide to the user a more friendly error message without
losing the original information of the error itself, extremely useful for debugging purposes.

```ts
import { Exception } from '@byloth/exceptions';

try {
    // [...]
} catch (error) {
    // [...]

    throw new Exception("I wasn't able to retrieve the current user information. Please, try again later.", error);
}
```

The above code might throw an exception like this:

```
Uncaught Exception: I wasn't able to retrieve the current user information. Please, try again later.
    at @example/store/user.ts:37:15
    at @example/main.ts:23:17

Caused by HttpException: HTTP Error 500 (Internal Server Error) for URL 'https://example.com/api/v1/users'
    at @example/services/http.ts:33:9
    at @example/models/user.ts:47:17
    at @example/store/user.ts:12:9
    at @example/main.ts:23:17

Caused by Error: Internal Server Error
    at node_modules/a-random-http-library/_internals/fetch.js:2:354
    at node_modules/a-random-http-library/index.js:1:756
    at @example/services/http.ts:15:11
    at @example/models/user.ts:47:17
    at @example/store/user.ts:12:9
    at @example/main.ts:23:17
```

> *So much better, isn't it?* 😎

### Typed exceptions

JavaScript cannot handle multiple types of exceptions, by design.  
Unlike other languages, it doesn't allow you using multiple
`catch` blocks to differentiate your handler logic.

How many times, while developing, have you caught an exception and
then checked the error message / type to know what to do next?  
Of course, forced to write a lot of `if` - `else`
statements to handle all the different cases.

> *Is it boring, right?* 😴

This library allows you to build your own exception handlers, so you
can easily handle different types of exceptions in a more elegant way.

```ts
import { HandlerBuilder } from '@byloth/exceptions';
import { useVuert } from '@byloth/vuert';

import { HttpException, NetworkException, UnauthorizedException } from '@example/exceptions/http';

try {
    // [...]
} catch (error) {
    // Here `error` is of type `unknown`.

    const vuert = useVuert();
    const handler = new HandlerBuilder()
        .on(UnauthorizedException, (exc) => {
            // If `error` is of type `UnauthorizedException`,
            //  then this block will be executed with `exc`
            //  as `error` casted to `UnauthorizedException`.

            vuert.emit({
                type: 'error',
                icon: 'circle-xmark',
                title: "Unauthorized",
                message: "You're not authorized to access this resource. Please, login first.",
                dismissable: true
            });
        })
        .on([HttpException, NetworkException], (exc) => {
            // If `error` is of type `HttpException` or `NetworkException`,
            //  then this block will be executed with `exc` as `error`
            //  casted to `HttpException | NetworkException`.

            vuert.emit({
                type: 'error',
                icon: 'link-slash',
                title: "Communication error",
                message: "There was an error while trying to access the server. Please, try again later.",
                dismissable: true
            });
        })
        .default((exc) => {
            // If `error` is none of the above types,
            //  then this block will be executed with
            //  `exc` as `error` casted to `unknown`.

            vuert.emit({
                type: 'error',
                icon: 'bug',
                title: "Unknown error",
                message: "Something unexpected went wrong. Please, contact our support team.",
                dismissable: true
            });
        });

    handler.handle(error);
}
```

### Handled exceptions

Let's say you are developing your web application and you want to handle errors in a smart way.

The first thing you might think of is to centralize all the error
handling logic in a single place, so you can easily maintain it.  
To be sure that you're catching all the errors, you place
this logic at the outermost level of your application.

Unfortunately, after a while, you start to realize that -in some cases- you
can't simply propagate the errors at the top level because you need to
handle them in some middle layer of your application to perform some
other specific operations before actually propagating them.  
To make things worse, you have also to provide some specific output to the user
making the default error handling logic redundant and annoying for the user.

At this point, you might think of a solution to handle the errors directly
in the middle layer of your application, without propagating them to the top
level; but, how can you do that without duplicating the error handling logic?

Here comes the new `HandledException` class instroduced by this library.  
It allows you to handle an exception in whatever place of your application you want,
performing every operation you might need and then propagating it to the top level.

For instance, let's say you want to retrieve the current user information from a remote server.  
In case of a '401 Unauthorized' error, you want to automatically logout the user,
show a snackbar message to the user and redirect him to the login page;
any other error should be simply propagated to the top level.

Here's an example of how you can do that:

```ts
import { useRouter } from "vue-router";

import { HandlerBuilder } from '@byloth/exceptions';
import { useVuert } from '@byloth/vuert';

import { UnauthorizedException } from '@example/exceptions/http';
import { HttpRequest, HttpResponse } from '@example/services/http';

async function getCurrentUser(): Promise<User>
{
    try {
        const response: HttpResponse = await HttpRequest.Get('/users/me');

        // [...]
    } catch (error) {
        new HandlerBuilder()
            .on(UnauthorizedException, (exc) => {
                logoutUser();
                useRouter().push('/login');

                throw new HandledException(exc);
            })
            .handle(error);
    }
}

function logoutUser(): void
{
    localStorage.removeItem('user:auth_token');

    useVuert().emit({
        type: 'info',
        priority: 'low',
        icon: 'user-secret',
        title: "Logged out",
        message: "You've been logged out successfully.",
        timeout: 5000
    });
}
```

Assuming also that the top level error handler is defined as follows:

```ts
import { HandlerBuilder } from '@byloth/exceptions';
import { useVuert } from '@byloth/vuert';

function errorHandler(error: unknown): void
{
    new HandlerBuilder()
        .default((exc) => useVuert().emit({
            type: 'error',
            icon: 'bug',
            title: "Unknown error",
            message: "Something unexpected went wrong. Please, contact our support team.",
            dismissable: true
        }))
        .handle(error);
}
```

In a case like this, the user will see a snackbar message,
will be redirected to the login page and nothing more.  
At the same time, a developer would be able to read in the console
a warning message, telling him that an exception was occurred but it was
correctly handled by the application and where it was handled exactly.

```
HandledException: The original exception has already been handled successfully.
    at @example/store/user.ts:37:15
    at @example/main.ts:23:17

Handled UnauthorizedException: You're not authorized to access this resource. Please, login first.
    at @example/services/http.ts:96:23
    at @example/models/user.ts:47:17
    at @example/store/user.ts:12:9
    at @example/main.ts:23:17

Caused by HttpException: HTTP Error 401 (Unauthorized) for URL 'https://example.com/api/v1/users'
    at @example/services/http.ts:33:9
    at @example/models/user.ts:47:17
    at @example/store/user.ts:12:9
    at @example/main.ts:23:17

Caused by Error: Unauthorized
    at node_modules/a-random-http-library/_internals/fetch.js:2:354
    at node_modules/a-random-http-library/index.js:1:756
    at @example/services/http.ts:15:11
    at @example/models/user.ts:47:17
    at @example/store/user.ts:12:9
    at @example/main.ts:23:17
```
