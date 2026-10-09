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
