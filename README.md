# Auth0 Actions Template

A TypeScript template for writing, testing, and bundling [Auth0 Actions](https://auth0.com/docs/customize/actions).
Each handler is built into a standalone CommonJS file ready to be pasted or deployed to Auth0.

## Features

- TypeScript with typings from `@auth0/actions`
- Middleware wrapper (`auth0Middleware`) with an execution `condition` and a custom `errorHandler`
- `ActionError` / `postLoginErrorHandler` for denying access with an error code
- Vite build that produces one CJS bundle per handler
- Vitest for tests, Prettier for formatting
- `@common` path alias for shared code

## Project structure

```
build.ts                         Build script (one bundle per handler)
src/
  types.ts
  common/
    action-error.ts              ActionError, ErrorCode, postLoginErrorHandler
    middleware/
      middleware.ts              auth0Middleware wrapper
      middleware.types.ts        Middleware types (add new triggers here)
  handlers/
    <trigger>/<handler>.ts       e.g. post-login/handler.ts
tests/handlers/                  Handler tests
dist/                            Build output (generated)
```

## Getting started

Requires Node.js (Volta pins `24.13.0`).

```sh
npm install
```

## Scripts

| Command                  | Description                                |
| ------------------------ | ------------------------------------------ |
| `npm run build`          | Bundle all handlers into `dist/<trigger>/` |
| `npm test`               | Run tests once with Vitest                 |
| `npm run test:coverage`  | Run tests with Istanbul coverage           |
| `npm run typecheck`      | Type-check with `tsc --noEmit`             |
| `npm run prettier`       | Format all files                           |
| `npm run prettier:check` | Check formatting                           |

## Writing a handler

Handlers live in `src/handlers/<trigger>/`. Wrap your logic with `auth0Middleware`:

```ts
import type { Event, PostLoginAPI } from '@auth0/actions/post-login/v3';
import { postLoginErrorHandler } from '@common/action-error';
import { auth0Middleware } from '@common/middleware/middleware';

const handler = async (event: Event, api: PostLoginAPI): Promise<void> => {
  api.accessToken.setCustomClaim('userEmail', event.user.email);
};

export const onExecutePostLogin = auth0Middleware<'postLogin'>(handler, {
  condition: event => !!event.user.email, // skip when false
  errorHandler: postLoginErrorHandler, // ActionError => api.access.deny
});
```

- `condition`: the handler runs only if it returns `true` (default: always).
- `errorHandler`: receives `api` and handles errors thrown by the handler (default: rethrow).
- Throw `ActionError` with an `ErrorCode` to deny access; define your own codes in `src/common/action-error.ts`.
- To support other triggers, extend `MiddlewareTypesMap` in `middleware.types.ts`.

## Build and deploy

```sh
npm run build
```

Every `.ts` file (excluding tests and `.d.ts`) directly inside a `src/handlers/<trigger>/` folder becomes `dist/<trigger>/<file>.js`. Dependencies listed in `package.json` are treated as external, so bundle-time needs must be considered when using npm packages in Auth0 Actions. Deploy the resulting file via the Auth0 dashboard, Auth0 CLI, or Deploy CLI.
