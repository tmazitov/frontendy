import API from "../api/api";
import { getTokens } from "../api/client";
import GameComponent from "../components/content/game-page-content/GameComponent";
import DashboardComponent from "../layouts/dashboard/DashboardLayout";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import Player from "../pkg/game/play/player";
import router from "./router";

export default class GamePage extends FrontendyComponent {
    componentName: string = 'game-page';

    data() {
        return {}
    }

    protected onMounted(): void {
        const tokens = getTokens();
        if (!tokens) {
            router.push('home');
            return;
        }

        let isCallbackActivated = false
        const onUnauthorizedCallback = () => {
            if (isCallbackActivated) {
                router.push('home');
                return ;
            }
            isCallbackActivated = true;
            API.ums.refresh()
            .then(() => Player.setup(tokens.accessToken, onUnauthorizedCallback))
        }

        Player.setup(tokens.accessToken, onUnauthorizedCallback);
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