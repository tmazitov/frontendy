import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

export default class InfoParagraphComponent extends FrontendyComponent {
    componentName: string = 'info-paragraph-component';

    constructor(text:string) {
        super({text});
    }

    template() {
        return elem("p")
            .setProps({ class : "text-gray-700 text-base mb-2" })
            .addChild(text(this.props.text))
    }
}