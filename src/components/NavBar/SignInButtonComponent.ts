import router from "../../pages/router";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

export default class SignInButtonComponent extends FrontendyComponent {
    componentName: string = 'sign-in-button-component';

    openSignInModalWindow() {
        // router.push("auth")
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
            .addChild(text("Sign In"))
            .addEventListener("click", () => this.openSignInModalWindow())
    }   
}