import type { Event, PostLoginAPI } from '@auth0/actions/post-login/v3';
import { auth0Middleware } from '@common/middleware/middleware';

const NAME_CLAIM = 'userEmail';
const EMAIL_CLAIM = 'userCompanyEmail';

const handler = async (event: Event, api: PostLoginAPI): Promise<void> => {
  api.accessToken.setCustomClaim(NAME_CLAIM, event.user.email);
  api.accessToken.setCustomClaim(EMAIL_CLAIM, event.user.email);
};

export const onExecutePostLogin = auth0Middleware<'postLogin'>(handler, {
  condition: event => !!event.user.email,
});
