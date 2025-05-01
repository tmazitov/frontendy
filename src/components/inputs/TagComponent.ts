import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

type TagColor = 
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

type TagComponentProps = {
    label: string;
    color: TagColor;
    icon?: string;
}

export default class TagComponent extends FrontendyComponent {
    componentName: string = 'tag-component';

    constructor(props: TagComponentProps) {
        super(props)
    }

    template() {

        const icon = this.props.icon ? 
            elem("i").setProps({class: this.props.icon}) : null

        return elem('div')
            .setProps({
                class: `flex flex-row items-center gap-2 bg-${this.props.color}-100 text-${this.props.color}-800 text-sm font-medium px-2.5 py-0.5 rounded`,
            })
            .setChild([
                icon,
                elem("div")
                .setProps({class : ""})
                .addChild(text(this.props.label))
            ])
    }
}