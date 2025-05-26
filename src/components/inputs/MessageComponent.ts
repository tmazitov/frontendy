import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

class MessageComponentOptions {
    color?: string  
}
export default class MessageComponent extends FrontendyComponent {
    componentName: string = 'message-component';

    constructor(message:string, opts:MessageComponentOptions = {}) {
        super({message, opts});
    }

    template() {

        const color = this.props.opts.color || "gray"

        return elem('p')
            .setProps({
                class : `${this.props.message ? 'block' : 'hidden'} text-${color}-700 text-sm`
            })
            .addChild(this.props.message)
    }
}