import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

type ButtonColor = 
    | 'red'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'purple'
    | 'pink'
    | 'indigo'
    | 'gray'
    | 'black'
    | 'white'
    | 'teal'
    | 'cyan'
    | 'lime'
    | 'amber'
    | 'orange'
    | 'emerald'
    | 'fuchsia'
    | 'rose';

type ButtonType =
    | 'default'
    | 'outline'
    | 'blank'

type ButtonProps = {
    label?: string,
    icon?: string,
    color?: ButtonColor,
    type?: ButtonType,
    fullWidth?: boolean,
}

export default class ButtonComponent extends FrontendyComponent {
    componentName: string = 'button-component';

    constructor(props: ButtonProps) {
        super(props)
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
        const color = this.props.color || 'gray'

        switch (type) {
            case 'default':
                return `bg-${color}-500 hover:bg-${color}-600 active:bg-${color}-700 text-white`
            case 'outline':
                return `border border-${color}-300 hover:bg-${color}-100 active:bg-${color}-200 text-${color}-500`
            case 'blank':
                return `bg-${color}-100 hover:bg-${color}-200 active:bg-${color}-300 text-gray-800`
            default:
                return `bg-${color}-200 hover:bg-${color}-300 active:bg-${color}-400 text-gray-800`
        }
    }

    template() {
        
        const iconOnly = !this.props.label && this.props.icon
        const buttonSize = `${iconOnly ? 'p-2' : 'px-4 py-2'} rounded-md ${this.props.fullWidth ? 'w-full' : ''} text-sm`
        const buttonColor = this.getButtonColor()
        const buttonAnime = "transition duration-200 ease-in-out"

        const button = elem('button')
        .setProps({
            class: `${buttonColor} ${buttonSize} ${buttonAnime} flex justify-center items-center`,
        })

        if (this.props.icon) {
            button.addChild(
                elem('i').setProps({ class: this.props.icon })
            )
        }
        if (this.props.label) {
            button.addChild(
                elem('span')
                    .setProps({ class: "ml-2" })
                    .addChild(text(this.props.label))
            )
        }

        if (this.state.clickHandler) {
            button.addEventListener('click', this.state.clickHandler)
        }

        return button
    }
}