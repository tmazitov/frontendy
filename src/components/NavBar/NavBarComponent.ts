import router from "../../pages/router";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import VElem from "../../pkg/frontendy/vdom/VElem";
import NavBarLink from "../../types/NavBarLink";

export default class NavBarComponent extends FrontendyComponent {
    componentName: string = 'counter-component';

    constructor(links:Array<NavBarLink>) {
        super({links})
    }

    data() {
        return {
            count: 0,
        }
    }

    navigate(link:NavBarLink) {
        console.log('navigate', link)
        router.push(link.routeName)
    }

    template() {
        return elem("div")
            .setProps({ 
                id: "nav-bar",
                class: "navbar flex flex-row gap-4 bg-gray-800 text-white p-4" 
            })
            .setChild(
                elem("div")
                .setProps({class : "nav-link cursor-pointer"})
                .$vfor(this.props.links, (elem:VElem, link:NavBarLink) => {
                    elem.addChild(text(link.label))
                    elem.addEventListener("click", () => this.navigate(link))
                })
            );
    }

    increment() {
        this.state.count++;
    }
}