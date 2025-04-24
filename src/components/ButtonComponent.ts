import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";

type ButtonType = 'primary' | 'default'
type ButtonProps = {
    label: string,
    type?: ButtonType,
    onClick: () => void,
}

export default class ButtonComponent extends FrontendyComponent {
    componentName: string = 'button-component';

    constructor(props: ButtonProps) {
        const { label, type, onClick } = props

        super({label, type, onClick})
    }

    getButtonColor(){
        const type = this.props.type || 'default'
        switch (type) {
            case 'primary':
                return 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white'
            case 'default':
                return 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800'
            default:
                return 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800'
        }
    }

    template() {
        return elem('button')
        .addChild(text(this.props.label))
        .addEventListener('click', this.props.onClick)
        .setProps({
            class: `${this.getButtonColor()} rounded-md px-4 py-2 transition duration-200 ease-in-out`,
        })
    }
}