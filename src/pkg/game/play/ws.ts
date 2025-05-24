import WebSocketClient from "../../ws-client/client";
import { PlayerAction } from "./player";
import ServerAction from "./server";

export default class GameWebSocket {
    private static conn: WebSocketClient<ServerAction> | undefined;

    public static connect():void {
        if (GameWebSocket.conn !== undefined) {
            console.warn("WebSocket connection already exists.");
            return;
        }

        GameWebSocket.conn = new WebSocketClient<ServerAction>("ws://localhost:5002/", {
            onOpenCallback: () => {
                console.log("GameWebSocket connection opened.");
            },
            onCloseCallback: () => {
                console.log("GameWebSocket connection closed.");
                GameWebSocket.conn = undefined;
            },
            onErrorCallback: (error: Event) => {
                console.error("GameWebSocket error:", error);
            }
        })
    }

    public static close():void {    
        if (GameWebSocket.conn === undefined) {
            console.warn("WebSocket connection does not exist.");
            return;
        }

        GameWebSocket.conn.close();
        GameWebSocket.conn = undefined;
    }

    private static send(action: PlayerAction, payload?: any):void {
        if (GameWebSocket.conn === undefined) {
            console.warn("WebSocket connection does not exist. Cannot send action.");
            return;
        }

        GameWebSocket.conn.send(action, payload);
    }

    public static playerMoveDown():void {
        GameWebSocket.send(PlayerAction.MoveDown);
    }

    public static playerMoveUp():void {
        GameWebSocket.send(PlayerAction.MoveUp);
    }

    public static playerStop():void {
        GameWebSocket.send(PlayerAction.Stop);
    }
}   