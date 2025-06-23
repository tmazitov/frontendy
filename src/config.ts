declare global {
    interface Window {
        __ENV__: {
            GOOGLE_OAUTH_CLIENT_ID: string;
            GOOGLE_OAUTH_REDIRECT_URI: string;
            UMS_ADDR: string;
            MMRS_ADDR: string;
            GAME_ADDR: string;
            MODE: string;
            SECURE: string;
        };
    }
}

export default class Config {
    static readonly googleOauthClientId: string = window.__ENV__.GOOGLE_OAUTH_CLIENT_ID || '';
    static readonly googleOauthRedirectUri: string = window.__ENV__.GOOGLE_OAUTH_REDIRECT_URI || '';
    static readonly umsAddr: string = window.__ENV__.UMS_ADDR || 'localhost:5000/auth';
    static readonly mmrsAddr: string = window.__ENV__.MMRS_ADDR || 'localhost:5001/mmrs';
    static readonly gameServerAddr: string = window.__ENV__.GAME_ADDR || 'localhost:5002/game';
    static readonly secure: boolean = window.__ENV__.SECURE === 'true';
}   