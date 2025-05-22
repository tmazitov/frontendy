import API from '../api';
import router from '../../pages/router';
import { cacheTokens } from '../client';
import { TokenPair } from '../tokenPair';

function generateRandomString(length: number = 128) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function sha256Base64Url(str: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await fakeSha256(data);
    return base64UrlEncode(hash);
}

function base64UrlEncode(buffer: Uint8Array) {
    return btoa(String.fromCharCode(...buffer))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function fakeSha256(data: Uint8Array): Promise<Uint8Array> {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        hash = (hash << 5) - hash + data[i];
        hash |= 0; // Convert to 32bit integer
    }
    const result = new Uint8Array(32).fill(hash & 0xff);
    return result;
}

export type GoogleOAuthPayload = {
    code: string;
    codeVerifier: string;
    redirectUri: string;
}

export default class GoogleOAuth {
    static async redirectToGoogle(clientId: string, redirectUri: string) {

        if (!clientId || !redirectUri) {
            console.log({ clientId, redirectUri });
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
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
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

        router.push("home")
    }
}