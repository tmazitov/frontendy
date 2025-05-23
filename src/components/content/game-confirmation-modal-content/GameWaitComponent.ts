import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import GameLauncher from "../../../pkg/game/launcher/gameLauncher";
import WaitPlayerBoxComponent from "./WaitPlayerBoxComponent";

export default class GameWaitComponent extends FrontendyComponent {
    componentName: string = 'game-wait-component';

    constructor(remainingTime: string) {
        super({remainingTime})
    }

    template() {

        const statuses:Array<string> = GameLauncher.getConfirmationStatus() || []

        return elem("span")
        .setChild([
            elem('p')
            .setProps({class : "text-sm text-gray-600 mb-2 text-start"})
            .addChild(text(`Remaining time : ${this.props.remainingTime}`)),
            
            elem('div')
            .setProps({class : "w-full flex gap-2 justify-center"})
            .setChild([
                ...statuses.map(status => new WaitPlayerBoxComponent(status))
            ])
        ])
    }
}