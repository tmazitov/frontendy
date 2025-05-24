import GameComponent from "../components/content/game-page-content/GameComponent";
import DashboardComponent from "../layouts/dashboard/DashboardLayout";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import Player from "../pkg/game/play/player";

export default class GamePage extends FrontendyComponent {
    componentName: string = 'game-page';

    data() {
        return {}
    }

    protected onMounted(): void {
        Player.setup();
    }

    protected onUnmounted(): void {
        console.log("GameComponent unmounted");
        Player.cleanup();
    }

    template() {
        const dashboard = new DashboardComponent()
            .setSlot("content", new GameComponent())
        
        return elem("div")
            .setProps({ id: "game-page"})
            .setChild([
                elem("div")
                .setProps({ class : "flex flex-col items-center p-4 pt-8" })
                .addChild(dashboard)
        ])
    }
}