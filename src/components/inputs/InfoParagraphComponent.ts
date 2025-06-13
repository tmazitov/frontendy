import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

type InfoParagraphComponentProps = {
    isTextCentered?: boolean,
}

export default class InfoParagraphComponent extends FrontendyComponent {
    componentName: string = 'info-paragraph-component';

    constructor(text:string, props: InfoParagraphComponentProps = {}) {
        super({text, ...props});
    }

    template() {
        return elem("p")
            .setProps({ class : `text-gray-700 text-base mb-2 ${this.props.isTextCentered ? 'text-center' : ''}` })
            .addChild(text(this.props.text))
    }
}