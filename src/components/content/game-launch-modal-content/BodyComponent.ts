import games from "../../../data/games";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import PreferModeStorage from "../../../pkg/game/launcher/preferedMode";
import Store from "../../../store/store";
import Game from "../../../types/Game";
import ButtonComponent from "../../inputs/ButtonComponent";
import GameCurrentRatingComponent from "./GameCurrentRatingComponent";
import GameDescriptionComponent from "./GameDescriptionComponent";
import GameOptionComponent from "./GameOptionComponent";

type GameLauchBodyProps = {
    onSubmit: (game: Game) => void;
}

export default class GameLauchBodyComponent extends FrontendyComponent {
    componentName: string = 'game-launch-body';

    constructor(props: GameLauchBodyProps) {
        super(props);
    }

    data() {
        return {
            rating: undefined,
            selectedOption: PreferModeStorage.get() ?? 0,
        }
    }

    protected onCreated(): void {
        Store.getters.userRating().then((rating:number|undefined) => {
            if (!rating) {
                return;
            }
            this.state.rating = rating
        })
    }

    updateSelectedOption(gameId:number) {
        if (this.state.selectedOption === gameId) {
            return
        }
        this.state.selectedOption = gameId;
        PreferModeStorage.save(gameId);
    }

    template() {
        return elem('div')
            .setChild([

                elem("div")
                .setProps({ class: "flex flex-row gap-4 mt-4"})
                .setChild([
                    ...games.map((option, index) => {
                        return new GameOptionComponent({
                            game: option,
                            isSelected: this.state.selectedOption === index,
                            onClick: this.updateSelectedOption.bind(this),
                        })
                    }),
                ]),

                elem("hr").setProps({ class: "my-4 border-gray-300" }),

                new GameDescriptionComponent(games[this.state.selectedOption]),
                new GameCurrentRatingComponent(this.state.rating),

                new ButtonComponent({
                    label: "Find Game",
                    color: "blue",
                    fullWidth: true,
                })
                .onClick(() => this.props.onSubmit(games[this.state.selectedOption])),
            ])
    }
}