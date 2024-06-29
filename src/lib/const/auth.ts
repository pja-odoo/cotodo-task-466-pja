import { ROUTES } from './routes';

export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'google_oauth_state';
export const GOOGLE_OAUTH_CODE_COOKIE_NAME = 'google_oauth_code';

export const AUTH_USER_ID_ENTROPY_SIZE = 10;

export const GOOGLE_SCOPES = ['profile', 'email'];

export const GOOGLE_PROVIDER_ID = 'google';

export const NEXT_REDIRECT_SEARCH_PARAMETER_NAME = 'redirectTo';

export const AUTH_PROVIDER_ROUTES = {
	[GOOGLE_PROVIDER_ID]: ROUTES.AUTH_GOOGLE.url
};

export const PROTECTED_ROUTES = ['/w/*', '/'];
