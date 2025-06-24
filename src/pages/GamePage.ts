import GameComponent from "../components/content/game-page-content/GameComponent";
import EventBroker from "../pkg/event-broker/eventBroker";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import GameLauncher from "../pkg/game/launcher/gameLauncher";
import Player from "../pkg/game/play/player";
import GameWebSocket from "../pkg/game/play/ws";
import TimerStorage from "../pkg/timer";
import Store from "../store/store";

export default class GamePage extends FrontendyComponent {
    componentName: string = 'game-page';

    protected data(): {} {
        return {
            counter: 0,
        };
    }

    protected onCreated(): void {
        EventBroker.getInstance().on("game-page-rerender", () => this.state.counter++);
    }

    protected onUnmounted(): void {
        GameWebSocket.close();
        GameLauncher.stopGameSearching();
        Store.setters.setupUser();
        EventBroker.getInstance().off("game:page:rerender");
        localStorage.removeItem("final-match-found");
        localStorage.removeItem("start-searching-final-match")

        Store.setters.removeGameSceneInfo();
        Store.setters.removeGamePlayersInfo();

        TimerStorage.removeTimer(`game-paddle-left`);
        TimerStorage.removeTimer(`game-paddle-right`);
        TimerStorage.removeTimer(`game-ball`);
        TimerStorage.removeTimer("game-waiting");
    }

    template() {
        const dashboard = elem("div")
        .setProps({class: "rounded-lg overflow-hidden shadow-md bg-white p-6 w-fit h-fit transition-all duration-300 ease-in-out"})
        .addChild(new GameComponent())

        return elem("div")
            .setProps({ id: "game-page"})
            .setChild([
                elem("div")
                .setProps({ class : "flex flex-col items-center p-4 pt-8" })
                .setChild([
                    dashboard,

                ])
        ])
    }
}