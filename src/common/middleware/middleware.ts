import type { PostLoginAPI } from '@auth0/actions/post-login/v3';
import { ActionError } from '@common/action-error';
import { Auth0MiddlewareOptions, MiddlewareTypesMap } from './middleware.types';

const errorHandler = (api: PostLoginAPI) => (error: Error | ActionError) => {
  if (error instanceof ActionError) {
    // log meessage
    console.log(`ActionError: ${error.message}`);
    api.access.deny(error.code);
  } else {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

const defaultOptions: Auth0MiddlewareOptions<'postLogin'> = {
  condition: () => true,
};

export const auth0Middleware = <K extends keyof MiddlewareTypesMap>(
  handler: (
    event: MiddlewareTypesMap[K]['event'],
    api: MiddlewareTypesMap[K]['api']
  ) => Promise<void>,
  options: Auth0MiddlewareOptions<K> = defaultOptions
) => {
  return async (event: MiddlewareTypesMap[K]['event'], api: MiddlewareTypesMap[K]['api']) => {
    if (options.condition(event)) {
      await handler(event, api).catch(errorHandler(api));
    }
  };
};
