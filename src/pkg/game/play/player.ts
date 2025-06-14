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
}

export default class Player {
    private static moveController: MoveController = new MoveController();
    private static moveHandler: ((event: KeyboardEvent) => void) | undefined;
    private static stopHandler: ((event: KeyboardEvent) => void) | undefined;

    public static setup(accessToken:string, callbacks?:PlayerConnectionCallbacks) {

        GameWebSocket.on(SERVER_ACTION.Authorized, (data) => Player.onAuthorizedHandler(data, callbacks?.onAuthorized ?? undefined));
        GameWebSocket.on(SERVER_ACTION.Unauthorized, () => Player.onUnauthorizedHandler(callbacks?.onUnauthorized))
        
        GameWebSocket.connect({
            serverAddr: Config.gameServerAddr,
            onOpenCallback: () => GameWebSocket.join(accessToken)
        })
    }

    private static onAuthorizedHandler(data:any, onAuthorizedCallback?:(state: MatchInfo) => void) {
        console.log("Player setup complete. Listening for key events...");

        const payload = data.payload as MatchInfo;
        onAuthorizedCallback?.(payload);

        this.moveHandler = (event:KeyboardEvent) => this.moveController.move(event);
        this.stopHandler = (event:KeyboardEvent) => this.moveController.stop(event);

        window.addEventListener("keydown", this.moveHandler);
        window.addEventListener("keyup", this.stopHandler);
    }

    private static onUnauthorizedHandler(onUnauthorizedCallback?:Function) {
        GameWebSocket.close()
        onUnauthorizedCallback?.()
    }

    public static cleanup() {
        GameWebSocket.close();

        console.log("Player cleanup complete. Removing key event listeners...");

        if (this.moveHandler) {
            window.removeEventListener("keydown", this.moveHandler);
        }
        if (this.stopHandler) {
            window.removeEventListener("keyup", this.stopHandler);
        }

        this.moveHandler = undefined;
        this.stopHandler = undefined;
    }

    public static onUpdatePosition(fn:(state:GameState) => void): void {
        GameWebSocket.on(SERVER_ACTION.Sync, fn)
    }

}

export {
    PLAYER_ACTION,
}