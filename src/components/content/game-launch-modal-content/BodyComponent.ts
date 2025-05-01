import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import PreferModeStorage from "../../../pkg/game-launcher/preferedMode";
import ButtonComponent from "../../inputs/ButtonComponent";
import GameCurrentRatingComponent from "./GameCurrentRatingComponent";
import GameDescriptionComponent from "./GameDescriptionComponent";
import GameOptionComponent from "./GameOptionComponent";

const gameOptions = [
    { title: "Training", icon: "ti ti-robot"},
    { title: "Duel", icon: "ti ti-users"},
    { title: "Turnament", icon: "ti ti-tournament"},
]

export default class GameLauchBodyComponent extends FrontendyComponent {
    componentName: string = 'game-launch-body';

    data() {
        return {
            selectedOption: PreferModeStorage.get() ?? 0,
        }
    }

    updateSelectedOption(id:number) {
        if (this.state.selectedOption === id) {
            return
        }
        this.state.selectedOption = id;
        PreferModeStorage.save(id);
    }

    template() {
        return elem('div')
            .setChild([

                elem("div")
                .setProps({ class: "flex flex-row gap-4 mt-4"})
                .setChild([
                    ...gameOptions.map((option, index) => {
                        return new GameOptionComponent({
                            id: index,
                            title: option.title,
                            icon: option.icon,
                            isSelected: this.state.selectedOption === index,
                            onClick: (id: number) => {
                                if (this.state.selectedOption === id) {
                                    return
                                }
                                this.state.selectedOption = id;
                            }
                        })
                    }),
                ]),

                elem("hr").setProps({ class: "my-4 border-gray-300" }),

                new GameDescriptionComponent(this.state.selectedOption),
                new GameCurrentRatingComponent(1000-7),

                new ButtonComponent({
                    label: "Find Game",
                    type: "primary",
                })
            ])
    }
}