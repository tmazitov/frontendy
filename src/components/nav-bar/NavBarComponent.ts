import router from "../../pages/router";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import NavBarLink from "../../types/NavBarLink";
import AuthModal from "../modals/AuthModal";
import NavBarItemComponent from "./NavBarItemComponent";

export default class NavBarComponent extends FrontendyComponent {
    componentName: string = 'nav-bar-component';

    constructor(links:Array<NavBarLink>, isAuthorized:boolean = false) {
        super({links, isAuthorized})
    }

    data() {
        return {
            showAuthModal: false,
        }
    }

    navigate(routeName: string) {
        console.log('navigate', routeName)
        router.push(routeName)
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
                                icon: link.icon,
                                label: link.label,
                                onClick: () => this.navigate(link.routeName)
                            })
                        })),

                        // Sign in button
                        this.props.isAuthorized ?
                            new NavBarItemComponent({
                                icon: "ti ti-user",
                                label: "Profile",
                                onClick: () => this.navigate("profile")
                            })
                        :
                            new NavBarItemComponent({
                                icon: "ti ti-login-2",
                                label: "Sign in",
                                onClick: () => {
                                    this.state.showAuthModal = true;
                                }
                            }),
                    ]),

            // Sign in / up modal window

            new AuthModal()
                .setShow(this.state.showAuthModal),
            ])
        ])
    }
}