import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

export default class GameOverIconComponent extends FrontendyComponent {
    componentName: string = 'game-over-icon-component';

    constructor(icon?: string) {
        super({icon});
    }

    template() {
        return elem("i").setProps({
            class: `ti ti-${this.props.icon} text-4xl`,
            style: `display: ${this.props.icon ? 'block' : 'none'};`
        }) 
    }
}