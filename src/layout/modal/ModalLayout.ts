import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import ModalLayoutCloseButton from "./ModalLayoutCloseButton";

type ModalLayoutOptions = {
    onClose?: Function,
    closeOnClickOutside?: boolean,
    customClasses?: string,
}

export default class ModalLayout extends FrontendyComponent {
    constructor(name: string, opts: ModalLayoutOptions = {}) {
        super({name, opts});
    }

    data() {
        return {
            show: false,
        }
    }

    public setShow(value: boolean) : FrontendyComponent {
        this.state.show = value;
        return this
    }

    slots() {
        return [
            'header',
            'body',
            'footer',
        ]
    }

    template() {

        if (!this.state.show) {
            return undefined
        }

        const header = this.useSlot("header");
        const body = this.useSlot("body");
        const footer = this.useSlot("footer");

        const defaultCardSize = 'min-h-20 min-w-20 max-w-80 rounded-lg shadow-lg bg-white'
        const cardSize = this.props.opts.customClasses || defaultCardSize;
        const cardPos = 'absolute left-1/2 transform -translate-x-1/2'

        const onCloseFuncion = this.props.opts.onClose;

        const backdrop = elem("div")
        .setProps({ class : "w-dvw h-dvh bg-black opacity-50 " })
        
        if (this.props.opts.closeOnClickOutside && onCloseFuncion) {
            backdrop.addEventListener("click", () => {
                onCloseFuncion.bind(this)();
            });
        }

        const headerComp = elem("div").$vif(header !== null)
        .setProps({ class: "px-6 py-4 flex gap-4 items-center " })

        if (this.props.opts.onClose) {
            const closeHandler = onCloseFuncion ? 
                onCloseFuncion.bind(this) : undefined

            headerComp.addChild(new ModalLayoutCloseButton(closeHandler))
        }

        headerComp.addChild(header)

        return elem("div")
            .setProps({ class : `fixed top-0 left-0 z-10 flex items-center` })
            .setChild([

                // Backdrop (outside click --> close)
                backdrop,

                // Modal Window (with header and body slots)
                elem("div")
                .setProps({ class: ` ${cardSize} ${cardPos}  overflow-hidden` })
                .setChild([

                    // Header
                    headerComp,

                    // Body
                    elem("div")
                    .setProps({ class: "p-6 pt-0" })
                    .addChild(body),

                    // Footer
                    elem("div").$vif(footer !== null)
                    .setProps({ class: "p-6 pt-0" })
                    .addChild(footer),
                ])
            ]);
    }
}