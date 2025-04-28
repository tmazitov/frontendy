import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";

export default class FrontendyModal extends FrontendyComponent {
    constructor(name: string, onClose:Function) {
        super({name, onClose});
    }

    data() {
        return {
            show: false,
        }
    }

    public setShow(value: boolean) {
        this.state.show = value;
        return this
    }

    slots() {
        return [
            'header',
            'body',
        ]
    }

    template() {

        const header = this.useSlot("header");
        const body = this.useSlot("body");

        const cardSize = 'h-20 w-20 rounded-lg shadow-lg bg-white'
        const cardPos = 'absolute top-20 left-35 right-35 z-20'

        return elem("div").$vif(this.state.show)
            .setProps({ class : `fixed top-0 left-0 z-10` })
            .setChild([

                elem("div")
                .setProps({ class : "w-dvw h-dvh bg-black opacity-50" })
                .addEventListener("click", this.props.onClose.bind(this)),

                elem("div")
                .setProps({ class: ` ${cardSize} ${cardPos}` })
                .setChild([
                    elem("div").$vif(header !== null)
                    .setProps({ class: "modal-header" })
                    .addChild(header),
                elem("div")
                    .setProps({ class: "modal-body" })
                    .addChild(body),
                ])
            ]);
    }
}