import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";

type CancelButtonProps = {
    onClick: () => void,
}

export default class CancelButtonComponent extends FrontendyComponent {
    componentName: string = 'cancel-button-component';

    constructor(props: CancelButtonProps) {
        super(props);
    }

    template() {
        return elem('div')
        .setProps({class : "w-6 h-6 flex justify-center items-center transition duration-300 hover:bg-red-200 active:bg-red-300 rounded-full cursor-pointer"})
        .setChild([
            elem("i").setProps({class: "ti ti-x text-red-500 text-md"})
        ])
        .addEventListener("click", this.props.onClick)
    }
}