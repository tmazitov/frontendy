import GameComponent from "../components/content/game-page-content/GameComponent";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";

export default class GamePage extends FrontendyComponent {
    componentName: string = 'game-page';

    template() {
        const dashboard = elem("div")
        .setProps({class: "w-[calc(1000px+3rem)] rounded-lg overflow-hidden shadow-md bg-white p-6"})
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