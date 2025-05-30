import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

type LoadingLayoutProps = {
    label: string;
    icon: string;
    withoutShadow?: boolean;
}

export default class LoadingLayout extends FrontendyComponent {
    componentName: string = 'loading-layout';
    
    constructor(props: LoadingLayoutProps) {
        super(props);
    }

    data(){
        return {
            show: false,
        }
    }

    setShow(value: boolean) {
        this.state.show = value;
        return this
    }

    template() {

        return elem('div').$vif(this.state.show)
            .setProps({class : "absolute top-0 left-0 w-full h-full flex items-center justify-center"})
            .setChild([
                elem("div")
                .setProps({class : `${this.props.withoutShadow ? 'hidden' : ''} absolute z-1 top-0 left-0 w-full h-full bg-gray-200 opacity-50`}),

                elem("div")
                .setProps({class : "absolute z-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center"})
                .setChild([
                    elem("i").setProps({class: `${this.props.icon} text-xl text-blue-500 animate-spin`}),
                    elem("p").setProps({class: "text-gray-700 mt-2"})
                        .addChild(text(this.props.label))
                ])
            ])
    }
}