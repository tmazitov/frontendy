import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

type ButtonType = 'primary' | 'default'
type ButtonProps = {
    label: string,
    type?: ButtonType,
}

export default class ButtonComponent extends FrontendyComponent {
    componentName: string = 'button-component';

    constructor(props: ButtonProps) {
        const { label, type } = props

        super({label, type })
    }

    data() {
        return {
            clickHandler: () => {},
        }
    }

    onClick(fn:Function) {
        this.state.clickHandler = fn
        return this
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
        
        const buttonSize = "px-4 py-2 rounded-md w-full h-10 text-sm"
        const buttonColor = this.getButtonColor()
        const buttonAnime = "transition duration-200 ease-in-out"

        const button = elem('button')
            .addChild(text(this.props.label))
            .setProps({
                class: `${buttonColor} ${buttonSize} ${buttonAnime} flex justify-center items-center`,
            })

        if (this.state.clickHandler) {
            button.addEventListener('click', this.state.clickHandler)
        }

        return button
    }
}