import API from "../../../api/api";
import WebSocketClient from "../../ws-client/client";
import { PLAYER_ACTION } from "./player";
import ServerAction from "./server";

type GameWebSocketParams = {
    serverAddr: string
    onOpenCallback?: Function
    onCloseCallback?: Function
    onErrorCallback?: Function
}

export default class GameWebSocket {
    private static conn: WebSocketClient<ServerAction> | undefined;
    private static activeListeners: Map<ServerAction, (data: any) => void> = new Map();
    private static params?: GameWebSocketParams;

    public static connect(params:GameWebSocketParams):void {
        this.params = params;
        if (GameWebSocket.conn !== undefined) {
            console.warn("WebSocket connection already exists.");
            return;
        }

        GameWebSocket.conn = new WebSocketClient<ServerAction>(`${API.ws()}://${params.serverAddr}/api/ws`, {
            onOpenCallback: () => {
                this.activeListeners.forEach((callback, action) => {
                    GameWebSocket.conn?.on(action, callback);
                });

                if (this.params?.onOpenCallback) {
                    this.params.onOpenCallback()
                }
            },
            onCloseCallback: () => {
                GameWebSocket.conn = undefined;
                if (this.params?.onCloseCallback) {
                    this.params.onCloseCallback()
                }
            },
            onErrorCallback: (error: Event) => {
                if (this.params?.onErrorCallback) {
                    this.params.onErrorCallback(error)
                }
            }
        })
    }

    public static on(action: ServerAction, callback: (data: any) => void): void {
        this.activeListeners.set(action, callback)
        if (GameWebSocket.conn !== undefined) {
            // console.warn("WebSocket connection does not exist. Cannot register action listener.");
            GameWebSocket.conn.on(action, callback);
            return;
        }
    }

    public static close():void {    
        if (GameWebSocket.conn === undefined) {
            return;
        }

        GameWebSocket.conn.close();
        GameWebSocket.conn = undefined;
    }

    private static send(action: PLAYER_ACTION, payload?: any):void {
        if (GameWebSocket.conn === undefined) {
            console.warn("WebSocket connection does not exist. Cannot send action.");
            return;
        }

        GameWebSocket.conn.send(action, {payload});
    }

    public static playerMoveDown():void {
        GameWebSocket.send(PLAYER_ACTION.MoveDown);
    }

    public static playerMoveUp():void {
        GameWebSocket.send(PLAYER_ACTION.MoveUp);
    }

    public static playerStop():void {
        GameWebSocket.send(PLAYER_ACTION.Stop);
    }

    public static join(accessToken: string):void {
        GameWebSocket.send(PLAYER_ACTION.Join, {accessToken})
    }
}   