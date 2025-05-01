import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import Game from "../../../types/Game";

type GameOptionProps = {
    game: Game
    isSelected: boolean;
    onClick: (id: number) => void;
}

export default class GameOptionComponent extends FrontendyComponent {
    componentName: string = 'game-option';

    constructor(props: GameOptionProps) {
        super(props);
    }

    template() {

        const sizeStyles = "w-24 h-24 flex flex-col items-center justify-center rounded-lg";
        const borderStyles = this.props.isSelected ? "border-blue-300" : "border-blue-100";
        const hoverStyles = this.props.isSelected ? "hover:border-blue-400" : "hover:border-blue-300";
        const backgroundStyles = this.props.isSelected ? "bg-blue-100" : "bg-white";

        return elem('div')
            .setProps({
                class: `${sizeStyles} border-2 ${borderStyles} ${hoverStyles} ${backgroundStyles} select-none cursor-pointer  shadow-md transition duration-300`,
            })
            .setChild([
                elem("i").setProps({ class: this.props.game.icon }),
                elem("p").setProps({ class: "text-sm mt-2"})
                    .addChild(text(this.props.game.name)),
            ])
            .addEventListener('click', () => {
                this.props.onClick(this.props.game.id)
            })
    }
}