import router from "../../pages/router";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import VElem from "../../pkg/frontendy/vdom/VElem";
import NavBarLink from "../../types/NavBarLink";
import NavBarItemComponent from "./NavBarItemComponent";

export default class NavBarComponent extends FrontendyComponent {
    componentName: string = 'nav-bar-component';

    constructor(links:Array<NavBarLink>) {
        super({links})
    }

    navigate(link:NavBarLink) {
        console.log('navigate', link)
        router.push(link.routeName)
    }

    borderStyles(){
        return [
            "rounded-xl"
        ].join(" ")
    }

    template() {
        return elem("div")
        .setProps({ class : "flex flex-col items-center p-4" })
        .setChild([
            elem("div")
            .setProps({ 
                id: "nav-bar",
                class: "max-w-2xl w-full rounded-lg navbar flex flex-row bg-white pr-4 shadow-md" 
            })
            .setChild([
                elem("h1")
                    .addChild(text("ft_transcendence"))
                    .setProps({ class : "text-l font-bold px-4 py-2"}),
                
                elem("div")
                    .setProps({ class : "flex flex-row justify-between w-full"})
                    .setChild([
                        
                        // Main navbar links

                        elem("div")
                        .setProps({ class : "flex flex-row" })
                        .setChild(this.props.links.map((link:NavBarLink) => {
                            return new NavBarItemComponent({
                                label: link.label,
                                onClick: () => this.navigate(link)
                            })
                        })),

                        // Sign in button

                        new NavBarItemComponent({
                            label: "Sign in",
                            onClick: () => {
                                console.log("Comming soon...")
                            }
                        }),
                    ])
            ])
        ])
    }
}