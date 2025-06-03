import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";

type ToggleComponentProps = {
    label? : string;
    isDisabled?: boolean;
}

export default class ToggleComponent extends FrontendyComponent {
    componentName: string = 'toggle-component';

    constructor(value: boolean, props?: ToggleComponentProps) {
        super({...props, value});
    }

    protected data(): {} {
        return {
            onClickCallback: undefined,
        }
    }

    public onClick(fn: Function) {
        this.state.onClickCallback = fn;
        return this;
    }

    private onClickHandler() {
        if (this.state.onClickCallback) {
            this.state.onClickCallback(!this.props.value);
        }   
    }

    template() {

        console.log("ToggleComponent template", this.props.value, this.props.label);

        
        const inputProps:any = {type: "checkbox", class: "w-4 h-4 cursor-pointer"}
        if (!this.props.isDisabled && this.props.value == true) {
            inputProps["checked"] = true;
        }

        const toggleInput = elem('input')
            .setProps(inputProps)
            .addEventListener('click', () => this.onClickHandler())

        const label = this.props.label ? elem('div')
            .setProps({class: "text-sm"})
            .addChild(this.props.label) : undefined;

        return elem('div')
        .setProps({class: "flex gap-4 items-center"})
        .setChild([
            label,
            toggleInput,
        ])
    }
}

// <label class="switch">
//   <input type="checkbox">
//   <span class="slider round"></span>
// </label>