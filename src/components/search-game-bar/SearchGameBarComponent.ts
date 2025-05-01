import EventBroker from "../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import Game from "../../types/Game";
import CancelButtonComponent from "./CancelButtonComponent";

export default class SearchGameBarComponent extends FrontendyComponent {
    componentName: string = 'find-game-bar-component';

    data() {
        return {
            interval: null,
            show: false,
            startedAt: new Date(),
            elapsedTime: "0:00",
            searchGame: null,
        }
    }

    updateTime() {
        const elapsedSeconds = Math.floor((new Date().getTime() - this.state.startedAt.getTime()) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        this.state.elapsedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    setSearchGame(game: Game) {
        if (this.state.searchGame == game) {
            return this;
        }
        this.state.searchGame = game;

        this.state.show = !!this.state.searchGame;
        if (this.state.show) {
            this.state.startedAt = new Date();
            this.state.interval = setInterval(this.updateTime.bind(this), 1000);
        } else {
            clearInterval(this.state.interval);
            this.state.interval = null;
        }

        return this;
    }

    onUnmounted(): void {
        if (this.state.interval) {
            clearInterval(this.state.interval);
            this.state.interval = null;
        }
    }

    onCancel() {
        console.log("Cancel button clicked, stopping the game search.");
        EventBroker.getInstance().emit("deactivate-find-game-bar");
    }

    template() {
        const position = `fixed left-0 bottom-0 w-full h-20 bg-gray-200 flex items-center justify-center`;
        const toast = "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white py-2 px-4"

        return elem('div').$vif(this.state.show)
            .setProps({ class: `${position} z-1000` })
            .setChild([
                elem('div')
                .setProps({ class: `${toast} flex gap-4 justify-between` })
                .setChild([
                    elem('div')
                    .setProps({ class: "flex gap-4 items-center" })
                    .setChild([
                        elem('p')
                        .setProps({ class: "text-gray-700", style: "width: 5ch"})
                        .addChild(text(this.state.elapsedTime)),
                        
                        elem('p')
                        .setProps({ class: "text-gray-700" })
                        .addChild(text(this.state.searchGame?.name)),

                        elem('p')
                        .setProps({ class: "text-gray-700" })
                        .addChild(text("Searching for a game...")),
                    ]),

                    new CancelButtonComponent({
                        onClick: this.onCancel.bind(this),
                    })
                ])
            ])
    }
}