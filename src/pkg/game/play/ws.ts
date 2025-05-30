import WebSocketClient from "../../ws-client/client";
import { PLAYER_ACTION } from "./player";
import ServerAction from "./server";

type GameWebSocketParams = {
    onOpenCallback?: Function
    onCloseCallback?: Function
    onErrorCallback?: Function
}

export default class GameWebSocket {
    private static conn: WebSocketClient<ServerAction> | undefined;

    public static connect(params:GameWebSocketParams):void {
        if (GameWebSocket.conn !== undefined) {
            console.warn("WebSocket connection already exists.");
            return;
        }

        GameWebSocket.conn = new WebSocketClient<ServerAction>("ws://localhost:5002/game/api/ws", {
            onOpenCallback: () => {
                console.log("GameWebSocket connection opened.");
                if (params.onOpenCallback) {
                    params.onOpenCallback()
                }
            },
            onCloseCallback: () => {
                console.log("GameWebSocket connection closed.");
                if (params.onCloseCallback) {
                    params.onCloseCallback()
                }
                GameWebSocket.conn = undefined;
            },
            onErrorCallback: (error: Event) => {
                if (params.onErrorCallback) {
                    params.onErrorCallback(error)
                }
                console.error("GameWebSocket error:", error);
            }
        })
    }

    public static on(action: ServerAction, callback: (data: any) => void): void {
        if (GameWebSocket.conn === undefined) {
            console.warn("WebSocket connection does not exist. Cannot register action listener.");
            setTimeout(() => this.on(action, callback), 100);
            return;
        }

        
        GameWebSocket.conn.on(action, callback);
        console.log("Registering action listener for:", action);
    }

    public static close():void {    
        if (GameWebSocket.conn === undefined) {
            console.warn("WebSocket connection does not exist.");
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
        console.log({accessToken})
        GameWebSocket.send(PLAYER_ACTION.Join, {accessToken})
    }
}   