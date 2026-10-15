import { PostLoginAPI } from '@auth0/actions/post-login/v3';

export enum ErrorCode {
  //TODO: change to whatever is a custom error for  the project
  Example = 'example',
}

export class ActionError extends Error {
  readonly code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = 'ActionError';
    this.code = code;
  }
}

export const postLoginErrorHandler = (api: PostLoginAPI) => (error: Error | ActionError) => {
  if (error instanceof ActionError) {
    // log meessage
    console.log(`ActionError: ${error.message}`);
    api.access.deny(error.code);
  } else {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};
