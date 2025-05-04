import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import GameSearcher from "../../../pkg/game-launcher/gameSercher";
import WaitPlayerBoxComponent from "./WaitPlayerBoxComponent";

export default class GameWaitComponent extends FrontendyComponent {
    componentName: string = 'game-wait-component';

    constructor(remainingTime: string) {
        super({remainingTime})
    }

    template() {

        const confirmed = GameSearcher.getMatchPlayer()

        return elem("span")
        .setChild([
            elem('p')
            .setProps({class : "text-sm text-gray-600 mb-2 text-start"})
            .addChild(text(`Remaining time : ${this.props.remainingTime}`)),
            
            elem('div')
            .setProps({class : "w-full flex gap-2 justify-center"})
            .setChild([
                ...confirmed.map(player => new WaitPlayerBoxComponent(player.status))
            ])
        ])
    }
}