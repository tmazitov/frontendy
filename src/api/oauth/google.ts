import API from '../api';
import router from '../../pages/router';
import { cacheTokens } from '../client';
import { TokenPair } from '../tokenPair';
import { sha256 } from 'js-sha256';
import EventBroker from '../../pkg/event-broker/eventBroker';
import Store from '../../store/store';

function generateRandomString(length: number = 128) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function sha256Base64Url(str: string): string {
    const hash = sha256.array(str); // returns Uint8Array
    const binary = String.fromCharCode(...hash);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

export type GoogleOAuthPayload = {
    code: string;
    codeVerifier: string;
    redirectUri: string;
}

export default class GoogleOAuth {
    static async redirectToGoogle(clientId: string, redirectUri: string) {

        if (!clientId || !redirectUri) {
            throw new Error("Client ID and redirect URI are required");
        }

        const codeVerifier = generateRandomString(128);
        const codeChallenge = await sha256Base64Url(codeVerifier);
        const state = generateRandomString(32);

        sessionStorage.setItem("code_verifier", codeVerifier);
        sessionStorage.setItem("pkce_state", state);

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=openid%20email%20profile&` +
        `state=${state}&` +
        `code_challenge=${codeChallenge}&` +
        `code_challenge_method=S256`;

        window.location.href = authUrl;
    }

    static async authorizeWithGoogle(redirectUri: string) {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        if (!code || !state) {
            throw new Error("Invalid response from Google OAuth");
        }

        const savedState = sessionStorage.getItem("pkce_state");
        const codeVerifier = sessionStorage.getItem("code_verifier");

        if (state !== savedState) {
            throw new Error("State mismatch!");
        }

        if (!codeVerifier) {
            throw new Error("Code verifier not found!");
        }

        // Отправляем на backend
        try {
            const response = await API.ums.loginWithGoogle({
                code,
                codeVerifier,
                redirectUri,
            })
            cacheTokens(response.data as TokenPair);
        } catch (error) {
            console.error("Error during Google OAuth authorization:", error);
            throw error;
        }

        // Удаляем из sessionStorage
        sessionStorage.removeItem("pkce_state");
        sessionStorage.removeItem("code_verifier");

        Store.setters.setupUser()

        EventBroker.getInstance().emit("update-auth");
        setTimeout(() => router.push("home"), 200);
    }
}