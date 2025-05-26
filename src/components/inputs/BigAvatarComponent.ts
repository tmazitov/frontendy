import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";

export default class BigAvatarComponent extends FrontendyComponent {
    componentName: string = 'big-avatar-component';

    constructor(props: {imagePath: string | null}) {
        super(props);
    }

    data() {
        return {
            onClickHandler: null,
        }
    }

    public onClick(fn: Function) {
        this.state.onClickHandler = fn;
        return this
    }

    template() {
        const avatar = this.state.onClickHandler ? "big-avatar-container " : ""

        return elem('div')
        .addEventListener("click", () => this.state.onClickHandler())
        .setProps({class: avatar + "w-32 h-32 rounded-full border-1 border-gray-400 overflow-hidden relative"})
        .setChild([
            elem('span')
            .setProps({class: "image"})
            .addChild(elem('img').setProps({class: "w-full object-cover", referrerpolicy: "no-referrer", src: this.props.imagePath})),

            elem('div').$vif(this.state.onClickHandler)
            .setProps({class: "text absolute text-sm text-white bottom-4 right-0 select-none left-0 text-center opacity-0 transition-all duration-200"})
            .addChild("Change photo"),
        ])
    }
}