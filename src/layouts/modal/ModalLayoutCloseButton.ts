import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";

const buttonSize = 'w-6 h-6';
const buttonColor = 'bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg ease-in-out duration-200';
const buttonInner = 'flex items-center justify-center';

export default class ModalLayoutCloseButton extends FrontendyComponent {
    componentName: string = 'modal-layout-close-button';

    constructor(onClick: Function) {
        super({onClick});
    }

    template() {

        const button = elem('button')
        .setProps({class : `${buttonSize} ${buttonColor} ${buttonInner}`})
        .addChild(elem("i").setProps({class : "ti ti-x"}))

        if (this.props.onClick) {
            button.addEventListener('click', this.props.onClick.bind(this))
        }

        return button
    }
}