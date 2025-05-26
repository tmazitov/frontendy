import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import GameLauncher from "../../pkg/game/launcher/gameLauncher";
import Game from "../../types/Game";
import CancelButtonComponent from "./CancelButtonComponent";
import ElapsedTimeComponent from "./ElapsedTimeComponent";

export default class SearchGameBarComponent extends FrontendyComponent {
    componentName: string = 'find-game-bar-component';

    data() {
        return {
            show: false,
            searchGame: null,
        }
    }


    setSearchGame(game: Game) {
        if (this.state.searchGame == game) {
            return this;
        }
        this.state.searchGame = game;
        this.state.show = !!this.state.searchGame;

        return this;
    }

    onCancel() {
        GameLauncher.stopGameSearching();
    }

    template() {
        const position = `fixed left-0 bottom-0 w-full h-20 bg-gray-200 flex items-center justify-center`;
        const toast = "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white py-2 px-4"

        return elem('div').$vif(this.state.show)
            .setProps({ class: `${position} z-5` })
            .setChild([
                elem('div')
                .setProps({ class: `${toast} flex gap-4 justify-between` })
                .setChild([
                    elem('div')
                    .setProps({ class: "flex gap-4 items-center" })
                    .setChild([
                        new ElapsedTimeComponent().setCounting(this.state.show),
                        
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