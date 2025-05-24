import WebSocketClient from "../../ws-client/client";
import { PlayerAction } from "./player";

export default class GameProc {
    private static conn: WebSocketClient<PlayerAction> | undefined;

    public static connect():void {
        if (GameProc.conn !== undefined) {
            console.warn("WebSocket connection already exists.");
            return;
        }

        GameProc.conn = new WebSocketClient<PlayerAction>("ws://localhost:5002/", {
            onOpenCallback: () => {
                console.log("WebSocket connection opened.");
            },
            onCloseCallback: () => {
                console.log("WebSocket connection closed.");
                GameProc.conn = undefined;
            },
            onErrorCallback: (error: Event) => {
                console.error("WebSocket error:", error);
            }
        })
    }

    public static close():void {    
        if (GameProc.conn === undefined) {
            console.warn("WebSocket connection does not exist.");
            return;
        }

        GameProc.conn.close();
        GameProc.conn = undefined;
    }

    private static send(action: PlayerAction, payload?: any):void {
        if (GameProc.conn === undefined) {
            console.warn("WebSocket connection does not exist. Cannot send action.");
            return;
        }

        GameProc.conn.send(action, payload);
    }

    public static playerMoveDown():void {
        GameProc.send(PlayerAction.MoveDown);
    }

    public static playerMoveUp():void {
        GameProc.send(PlayerAction.MoveUp);
    }

    public static playerStop():void {
        GameProc.send(PlayerAction.Stop);
    }
}   