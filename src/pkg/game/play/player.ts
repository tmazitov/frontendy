import MoveController from "./moveController";
import ServerAction from "./server";
import GameState from "./state";
import GameWebSocket from "./ws";

enum PlayerAction {
    Stop = 'stop',
    MoveUp = 'move_up',
    MoveDown = 'move_down',
}

export default class Player {
    private static moveController: MoveController = new MoveController();
    private static moveHandler: ((event: KeyboardEvent) => void) | undefined;
    private static stopHandler: ((event: KeyboardEvent) => void) | undefined;

    public static setup() {
        GameWebSocket.connect()

        console.log("Player setup complete. Listening for key events...");

        this.moveHandler = (event:KeyboardEvent) => this.moveController.move(event);
        this.stopHandler = (event:KeyboardEvent) => this.moveController.stop(event);

        window.addEventListener("keydown", this.moveHandler);
        window.addEventListener("keyup", this.stopHandler);
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
        GameWebSocket.on(ServerAction.SYNC, fn)
    }

}

export {
    PlayerAction,
}