import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

type NavBarItemProps = {
    icon: string,
    label: string|undefined,
    onClick: () => void,
}

export default class NavBarItemComponent extends FrontendyComponent {
    componentName: string = 'nav-bar-item-component';

    constructor(props: NavBarItemProps) {
        super(props);
    }

    getStyles() {
        const styles = {
            animation : "hover:bg-gray-100 active:bg-gray200 duration-200 ease-in-out",
            container : "flex items-center px-4 py-2",
            text : "cursor-pointer text-sm",
        }
        return `nav-link ${styles.container} ${styles.text} ${styles.animation}`
    }

    template() {
        return elem('div')
            .setProps({class : this.getStyles()})
            .setChild([
                elem("i").setProps({class: this.props.icon}),
                elem("span").setProps({class: "ml-2"})
                    .addChild(text(this.props.label))
            ])
            .addEventListener("click", this.props.onClick)
    }   
}