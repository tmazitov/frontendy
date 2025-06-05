declare global {
    interface Window {
        __ENV__: {
            GOOGLE_OAUTH_CLIENT_ID: string;
            GOOGLE_OAUTH_REDIRECT_URI: string;
        };
    }
}

export default class Config {
    static readonly googleOauthClientId: string = window.__ENV__.GOOGLE_OAUTH_CLIENT_ID || '';
    static readonly googleOauthRedirectUri: string = window.__ENV__.GOOGLE_OAUTH_REDIRECT_URI || '';
}   