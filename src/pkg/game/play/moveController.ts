import GameProc from "./ws";

export default class MoveController {
    private direction: number = 0;
    private pressedKeys: Set<string> = new Set();

    public move(event:KeyboardEvent): void {
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

    public stop(event:KeyboardEvent): void {
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