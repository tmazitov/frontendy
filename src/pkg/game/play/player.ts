import Config from "../../../config";
import { MatchInfo } from "../../../types/MatchInfo";
import MoveController from "./moveController";
import SERVER_ACTION from "./server";
import GameState from "./state";
import GameWebSocket from "./ws";

enum PLAYER_ACTION {
    Join = 'join',
    Stop = 'stop',
    MoveUp = 'move_up',
    MoveDown = 'move_down',
}

type PlayerConnectionCallbacks = {
    onAuthorized?: (state: MatchInfo) => void;
    onUnauthorized?: () => void;
    onCloseCallback?: () => void;
}

export default class Player {
    private static moveController: MoveController = new MoveController();

    public static setup(accessToken:string, callbacks?:PlayerConnectionCallbacks) {

        GameWebSocket.on(SERVER_ACTION.Authorized, (data) => Player.onAuthorizedHandler(data, callbacks?.onAuthorized ?? undefined));
        GameWebSocket.on(SERVER_ACTION.Unauthorized, () => Player.onUnauthorizedHandler(callbacks?.onUnauthorized))
        
        GameWebSocket.connect({
            serverAddr: Config.gameServerAddr,
            onOpenCallback: () => GameWebSocket.join(accessToken),
            onCloseCallback: () => this.onCloseHandler(callbacks?.onCloseCallback),
        })
    }

    private static onAuthorizedHandler(data:any, onAuthorizedCallback?:(state: MatchInfo) => void) {

        const payload = data.payload as MatchInfo;
        onAuthorizedCallback?.(payload);

        this.moveController.enable();
    }

    private static onUnauthorizedHandler(onUnauthorizedCallback?:Function) {
        GameWebSocket.close()
        onUnauthorizedCallback?.()
    }

    private static onCloseHandler(onCloseCallback?:Function) {
        onCloseCallback?.();
    }

    public static cleanup() {
        this.moveController.disable();
    }

    public static onUpdatePosition(fn:(state:GameState) => void): void {
        GameWebSocket.on(SERVER_ACTION.Sync, fn)
    }

}

export {
    PLAYER_ACTION,
}