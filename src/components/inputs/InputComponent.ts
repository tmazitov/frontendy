import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import InputLabelComponent from "./InputLabelComponent";

type InputOptions = {
    type?: string,
    placeholder?: string,
    label?: string,
    length?: number,
}

export default class InputComponent extends FrontendyComponent {
    componentName: string = 'input-component';

    constructor(value: string, opts: InputOptions = {}) {
        super({value, opts});
    }

    data() {
        return {
            inputHandler: null,
            enterHandler: null,
            blurHandler: null,
            focusHandler: null,
        }
    }

    onInput(fn:Function) {
        this.state.inputHandler = fn;
        return this
    }

    onBlur(fn:Function) {
        this.state.blurHandler = fn;
        return this
    }

    onFocus(fn:Function) {
        this.state.focusHandler = fn;
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

        const input = elem('input').setProps({
            class: `p-2 bg-transparent ${elemSize} ${elemBorder}`,
            value: this.props.value,
            type: this.props.opts.type ?? "text",
            length: this.props.opts.length,
            placeholder: this.props.opts.placeholder ?? "",
        })

        if (this.state.inputHandler) {
            input.addEventListener("input", (event: Event) => {
                const target = event.target as HTMLInputElement;
                this.state.inputHandler(target.value);
            })
        }
        
        if (this.state.blurHandler) {
            input.addEventListener("blur", ((event: Event) => {
                const target = event.target as HTMLInputElement;
                this.state.blurHandler(target.value);
            }) as EventListener)
        }

        if (this.state.focusHandler) {
            input.addEventListener("focus", ((event: Event) => {
                const target = event.target as HTMLInputElement;
                this.state.focusHandler(target.value);
            }) as EventListener)
        }

        if (this.state.enterHandler) {
            input.addEventListener("keydown", ((event: KeyboardEvent) => {
                const target = event.target as HTMLInputElement;
                if (event.key === "Enter") {
                    this.state.enterHandler(target.value);
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