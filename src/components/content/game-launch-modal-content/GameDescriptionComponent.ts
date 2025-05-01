import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import TagComponent from "../../inputs/TagComponent";

const descriptions = [
    "Fight against a bot to train your skills.",
    "Face off against another player in a 1v1 duel.",
    "Become the target of everyone and prove you're the king of the hill.",
]

const players = [
    1,
    2,
    8,
]

const gameNames = [
    "Training",
    "Duel",
    "Tournament",
]

export default class GameDescriptionComponent extends FrontendyComponent {
    componentName: string = 'game-description-component';

    constructor(gameId: number) {
        super({gameId})
    }

    template() {

        const gameId = this.props.gameId;
        const appropriateDescription = descriptions[gameId];
        if (!appropriateDescription) {
            return undefined
        }
        const appropriateNumber = players[gameId];
        if (!appropriateNumber) {
            return undefined
        }
        const appropriateGameName = gameNames[gameId];
        if (!appropriateGameName) {
            return undefined
        }

        return elem("span")
        .setChild([
            elem("div")
            .setProps({ class: "flex gap-2 mt-4"})
            .setChild([
                elem('h4')
                .setProps({class: "text-lg font-semibold text-gray-800"})
                .addChild(text(appropriateGameName)),

                new TagComponent({
                    label: `${appropriateNumber} player${appropriateNumber > 1 ? 's' : ''}`,
                    color: "blue",
                    icon: "ti ti-users",
                })
            ]),

            elem('p')
            .setProps({class: "text-sm text-gray-600 mt-2 max-w-xs"})
            .addChild(text(appropriateDescription)),
        ])
    }
}