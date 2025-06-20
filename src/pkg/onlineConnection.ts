import API from "../api/api";
import { getTokens, isAuthorized } from "../api/client";
import Config from "../config";
import WebSocketClient from "./ws-client/client";

enum UMSOnlineEvents {
    Unauthorized = 'unauthorized',
}

export default class UMSOnline {

    private static conn:WebSocketClient<UMSOnlineEvents> | null = null;

    public static connect() {
        if (!isAuthorized() || this.conn) {
            return ;
        }

        this.conn = new WebSocketClient<UMSOnlineEvents>(`${API.ws()}://${Config.umsAddr}/api/ws/online`, {
            onOpenCallback: () => this.sendJoin(),
        })
        this.conn.on(UMSOnlineEvents.Unauthorized, this.unauthorizedHandler.bind(this));
    }

    private static sendJoin() {
        if (!this.conn) {
            console.warn("Unable to send join request, connection is not established.");
            return;
        }

        const tokens = getTokens();
        if (!tokens || !tokens.accessToken) {
            console.warn("Unable to send join request, access token is missing.");
            return;
        }

        this.conn.send('join', {
            payload: {
                accessToken: tokens.accessToken,
            }
        });
    }

    private static unauthorizedHandler() {
        console.warn("UMSOnline: Unauthorized event received, closing connection.");
        API.ums.refresh().then(() => {
            this.disconnect();
            this.conn = new WebSocketClient<UMSOnlineEvents>(`${API.ws()}://${Config.umsAddr}/api/ws/online`, {
                onOpenCallback: () => this.sendJoin(),
            });
        })
    }

    public static disconnect() {
        if (this.conn) {
            this.conn.close();
            this.conn = null;
        }
    }
}