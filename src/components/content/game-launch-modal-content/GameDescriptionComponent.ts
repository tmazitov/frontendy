import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import Game from "../../../types/Game";
import TagComponent from "../../inputs/TagComponent";


export default class GameDescriptionComponent extends FrontendyComponent {
    componentName: string = 'game-description-component';

    constructor(game: Game) {
        super({game})
    }

    template() {

        const description = this.props.game.description;
        const number = this.props.game.players;
        const name = this.props.game.name;

        return elem("span")
        .setChild([
            elem("div")
            .setProps({ class: "flex gap-2 mt-4"})
            .setChild([
                elem('h4')
                .setProps({class: "text-lg font-semibold text-gray-800"})
                .addChild(text(name)),

                new TagComponent({
                    label: `${number} player${number > 1 ? 's' : ''}`,
                    color: "blue",
                    icon: "ti ti-users",
                })
            ]),

            elem('p')
            .setProps({class: "text-sm text-gray-600 mt-2 max-w-xs"})
            .addChild(text(description)),
        ])
    }
}