import GameProc from "./ws";

export default class MoveController {
    private direction: number = 0;
    private pressedKeys: Set<string> = new Set();
    private moveHandler: ((event: KeyboardEvent) => void) | undefined;
    private stopHandler: ((event: KeyboardEvent) => void) | undefined;

    public enable() {
        this.moveHandler = (event:KeyboardEvent) => this.move(event);
        this.stopHandler = (event:KeyboardEvent) => this.stop(event);

        window.addEventListener("keydown", this.moveHandler);
        window.addEventListener("keyup", this.stopHandler);
    }

    public disable() {
        if (this.moveHandler) {
            window.removeEventListener("keydown", this.moveHandler);
            this.moveHandler = undefined;
        }
        if (this.stopHandler) {
            window.removeEventListener("keyup", this.stopHandler);
            this.stopHandler = undefined;
        }
        this.direction = 0;
        this.pressedKeys.clear();
    }

    private move(event:KeyboardEvent): void {
        if (this.direction != 1 && event.key === "w") {
            GameProc.playerMoveUp();
            this.direction = 1;
        }   
        if (this.direction != -1 && event.key === "s") {
            GameProc.playerMoveDown();
            this.direction = -1;
        }
        if (event.key === 's' || event.key === 'w') {
            this.pressedKeys.add(event.key);
        }
    }

    private stop(event:KeyboardEvent): void {
        if (event.key !== 's' && event.key !== 'w') {
            return;
        }
        
        if (this.pressedKeys.has(event.key)) {
            this.pressedKeys.delete(event.key);
        }

        if (this.pressedKeys.size === 0) {
            this.direction = 0;
            GameProc.playerStop();
            return;
        }

        if (this.direction != 1 && this.pressedKeys.has("w")) {
            GameProc.playerMoveUp();
            this.direction = 1;
        } else if (this.direction != -1 && this.pressedKeys.has("s")) {
            GameProc.playerMoveDown();
            this.direction = -1;
        }
    }
}