import type { Event, PostLoginAPI } from '@auth0/actions/post-login/v3';
import { ActionError } from '@common/action-error';
export interface MiddlewareTypesMap {
  postLogin: {
    event: Event;
    api: PostLoginAPI;
  };
  // TODO: Add more types as the application needs grow
}

export type Auth0MiddlewareOptions<K extends keyof MiddlewareTypesMap> = {
  condition: (event: MiddlewareTypesMap[K]['event']) => boolean;
  errorHandler: (api: MiddlewareTypesMap[K]['api']) => (error: Error | ActionError) => void;
};
