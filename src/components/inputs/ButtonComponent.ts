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

type ButtonSize = 
    | 'small'
    | 'medium'
    | 'large';

type ButtonProps = {
    label?: string,
    icon?: string,
    color?: ButtonColor,
    type?: ButtonType,
    size?: ButtonSize,
    fullWidth?: boolean,
    isDisabled?: boolean,
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

    getButtonSize(iconOnly: boolean) {
        const size = this.props.size || 'medium'
        let sizeStyles = ""

        if (iconOnly) {
            switch (size) {
                case 'small':
                    sizeStyles = 'w-6 h-6 p-2'
                    break
                case 'large':
                    sizeStyles = 'w-10 h-10 p-6'
                    break
                default:
                    sizeStyles = 'w-8 h-8 p-4'
            }
        } else {
            switch (size) {
                case 'small':
                    sizeStyles = 'w-6 h-6 px-2 py-1 text-sm'
                    break
                case 'large':
                    sizeStyles = 'px-6 py-3 text-lg'
                    break
                default:
                    sizeStyles = 'px-4 py-2 text-base'
            }
        }

        if (this.props.fullWidth ) {
            sizeStyles += ' w-full'
        }


        return `${sizeStyles}`
    }

    template() {
        
        const iconOnly = !this.props.label && this.props.icon
        const buttonSize = `${this.getButtonSize(iconOnly)} rounded-lg`
        const buttonColor = this.getButtonColor()
        const buttonAnime = "transition duration-200 ease-in-out cursor-pointer"
        const buttonDisabledStyle = this.props.isDisabled ? "opacity-50 cursor-not-allowed" : ""

        const button = elem('button')
        .setProps({
            class: `${buttonColor} ${buttonSize} ${buttonAnime} ${buttonDisabledStyle} flex justify-center items-center`,
        })

        if (this.props.icon) {
            button.addChild(
                elem('i').setProps({ class: this.props.icon })
            )
        }
        if (this.props.label) {
            button.addChild(
                elem('span')
                    .setProps({ class: this.props.icon ? "ml-2" : undefined})
                    .addChild(text(this.props.label))
            )
        }

        if (this.state.clickHandler && !this.props.isDisabled) {
            button.addEventListener('click', this.state.clickHandler)
        }

        return button
    }
}