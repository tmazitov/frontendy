import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

export default class InputLabelComponent extends FrontendyComponent {
    componentName: string = 'input-label-component';

    constructor(label:string) {
        super({label});
    }

    template() {
        return elem('div')
            .setProps({class: "text-gray-700 text-sm"})
            .addChild(text(this.props.label))
    }
}