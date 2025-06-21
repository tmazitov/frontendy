import GameComponent from "../components/content/game-page-content/GameComponent";
import EventBroker from "../pkg/event-broker/eventBroker";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import Player from "../pkg/game/play/player";
import GameWebSocket from "../pkg/game/play/ws";
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
        Store.setters.setupUser();
        EventBroker.getInstance().off("game:page:rerender");
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