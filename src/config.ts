export default class Config {
    static readonly googleOauthClientId: string = window.__ENV__.GOOGLE_OAUTH_CLIENT_ID || '';
    static readonly googleOauthRedirectUri: string = window.__ENV__.GOOGLE_OAUTH_REDIRECT_URI || '';
}