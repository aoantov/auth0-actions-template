import { Auth0MiddlewareOptions, MiddlewareTypesMap } from './middleware.types';

const defaultOptions = {
  condition: () => true,
  errorHandler: () => (error: Error) => {
    throw error;
  },
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
      await handler(event, api).catch(options.errorHandler(api));
    }
  };
};
