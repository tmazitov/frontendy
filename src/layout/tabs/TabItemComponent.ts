import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

export default class TabItemComponent extends FrontendyComponent {
    componentName: string = 'tab-item';

    constructor(title: string, isActive: boolean) {
        super({ title, isActive });
    }

    data() {
        return {
            onClickHandler: null
        }
    }

    onClick(fn: () => void) {
        this.state.onClickHandler = fn;
        return this;
    }

    template() {

        const borderClass = this.props.isActive ? 
            "border-b-2 border-blue-500" : "border-b-2 border-transparent";


        return elem('div')
            .setProps({ class: `px-4 py-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 ${borderClass} transition duration-300 ease-in-out` })
            .addChild(text(this.props.title))
            .addEventListener('click', () => {
                if (this.state.onClickHandler) {
                    this.state.onClickHandler();
                }
            })
    }
}