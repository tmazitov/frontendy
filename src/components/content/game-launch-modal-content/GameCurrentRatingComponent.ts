import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import ToggleComponent from "../../inputs/ToggleComponent";

export default class GameCurrentRatingComponent extends FrontendyComponent {
    componentName: string = 'game-current-rating-component';

    constructor(rating: number, onlineMode: boolean) {
        super({rating,onlineMode})
    }

    protected data(): {} {
        return {
            onChangeGameModeCallback: undefined,
        }
    }

    public onChangeGameMode(fn: Function) {
        this.state.onChangeGameModeCallback = fn;
        return this;  
    }

    // private onChangeGameModeHandler(value:boolean) {
    //     if (this.state.onChangeGameModeCallback) {
    //         this.state.onChangeGameModeCallback(value);
    //     }
    // }
    
    template() {
        return elem('div')
        .setProps({class: "flex justify-between items-center mt-6 mb-2"})
        .setChild([
            elem("p")
            .setProps({ class: "text-sm text-gray-500"})
            .addChild(text(`Rating : ${this.props.rating}`)),

            // new ToggleComponent(this.props.onlineMode, {
            //     label: "Online Match"
            // }).onClick((value:boolean) => this.onChangeGameModeHandler(value))
        ])
    }
}