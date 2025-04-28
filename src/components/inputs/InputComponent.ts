import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import InputLabelComponent from "./InputLabelComponent";

type InputOptions = {
    type?: string,
    placeholder?: string,
    label?: string,
}

export default class InputComponent extends FrontendyComponent {
    componentName: string = 'input-component';

    constructor(value: string, opts: InputOptions = {}) {
        super({value, opts});
    }

    data() {
        return {
            inputHandler: null,
            enterHandler: null
        }
    }

    onInput(fn:Function) {
        this.state.inputHandler = fn;
        return this
    }

    onEnter(fn:Function) {
        this.state.enterHandler = fn;
        return this
    }

    focus() {
        if (!this.el || this.el instanceof Text) {
            return;
        }
        this.el.focus();
        if (this.el.tagName === "input") {
            this.el.focus();
        } else {
            this.el.querySelector("input")?.focus();
        }
    }

    template() {

        const elemBorder = "border-2 border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ease-in-out duration-200";
        const elemSize = "w-full h-8";

        const input = elem('input')
        .setProps({
            type: this.props.opts.type,
            value: this.props.value, 
            class: `p-2 bg-transparent ${elemSize} ${elemBorder}`,
            placeholder: this.props.opts.placeholder ?? "",
        })

        if (this.state.inputHandler) {
            input.addEventListener("input", (event: Event) => {
                const target = event.target as HTMLInputElement;
                this.state.inputHandler(target.value);
            })
        }

        if (this.state.enterHandler) {
            input.addEventListener("keydown", ((event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    this.state.enterHandler();
                }
            }) as EventListener)
        }

        if (this.props.opts.label) {
            return elem('div')
                .setChild([
                    new InputLabelComponent(this.props.opts.label),
                    input
                ])
        }

        return input
    }
}