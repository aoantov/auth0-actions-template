export enum ErrorCode {
  NO_CIAM = 'no_ciam',
  NO_EMAIL = 'no_email',
  UNSUPPORTED_TENANT = 'unsupported_tenant',
}

export class ActionError extends Error {
  readonly code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = 'ActionError';
    this.code = code;
  }
}
