import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

export default class GameOverTitleComponent extends FrontendyComponent {
    componentName: string = '';

    constructor(title: string) {
        super({ title });
    }

    template() {
        return elem('h1')
            .setProps({class: "text-2xl font-bold"})
            .addChild(this.props.title)
    }
}